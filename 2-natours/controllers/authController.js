const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, status, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    // Send output
    res.status(statusCode).json({
        status,
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, '201 Created', res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check if email & password exist
    if (!email || !password) {
        return next(
            new AppError(
                'Please provide email and password',
                400,
                '400 Bad Request'
            )
        );
    }

    // 2. Check if user exist & password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(
            new AppError('Email or Password not correct', 401, 'Unauthorized')
        );
    }

    // 3. Check everything ok, send token to client
    createSendToken(user, 200, '200 Ok', res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'Success', message: 'Logged Out' });
};

exports.protect = catchAsync(async (req, res, next) => {
    // 1. Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(
            new AppError('Your are not logged in', 401, 'Unauthorized')
        );
    }

    // 2. verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(
            new AppError(
                'The user belonging to this token does not exist.',
                401,
                'Unauthorized'
            )
        );
    }

    // 4. check if user change password after the jwt was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again',
                401,
                'Unauthorized'
            )
        );
    }

    // Grant access to protected route
    req.user = freshUser;
    res.locals.user = freshUser;
    next();
});

// Only for rendered pages, check user logged in or not
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1. verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2. check if user still exists
            const freshUser = await User.findById(decoded.id);
            if (!freshUser) {
                return next();
            }

            // 3. check if user change password after the jwt was issued
            if (freshUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = freshUser;
            return next();
        } catch (error) {
            return next();
        }
    }
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You don not have permission to perform this action',
                    403,
                    '403 Forbidden'
                )
            );
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError(
                'There is no user with that email address',
                404,
                'Not Found'
            )
        );
    }

    // 2. Generate then random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/password-reset/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });

        res.status(200).json({
            status: 'Ok',
            message: 'Token sent to email',
        });
    } catch {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
                500,
                'Server side error'
            )
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1. Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpire: { $gt: Date.now() },
    });

    // 2. if token has not expired and there is user, set the new password
    if (!user) {
        return next(
            new AppError('Token is invalid or expired', 400, 'Bad Request')
        );
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    // 3. Update changedPasswordAt property for the user
    // 4. Log the user in sen JWT
    createSendToken(user, 200, 'Password Updated', res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1. Get user from collection
    const user = await User.findById(req.user._id).select('+password');
    // 2. Check if posted current password is correct
    if (
        !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
        return next(
            new AppError('Your current password is wrong', 401, 'Unauthorized')
        );
    }

    // 3. If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. log user in, send JWT
    createSendToken(user, 201, 201, res);
});
