const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: '201 Created',
        token,
        data: {
            user: newUser,
        },
    });
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
    const token = signToken(user._id);
    res.status(200).json({
        status: 'Ok',
        token,
    });
});
