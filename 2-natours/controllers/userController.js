const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const filterObj = (obj, ...allowedField) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedField.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

// Get all users
exports.getAllUsers = getAll(User);

// Get user by id
exports.getUser = getOne(User);
// Create new user
exports.createUser = (req, res) => {
    res.status(403).json({
        status: 'This route not defined yet! Please use /signup',
    });
};

// Update user
exports.updateUser = updateOne(User);

// Delete user
exports.deleteUser = deleteOne(User);

exports.update_profile = catchAsync(async (req, res, next) => {
    // 1. Create error if user post password data
    if (req.body.password || req.body.passwordConfirm)
        next(
            new AppError(
                'This route is not for password update. Please use /update-password',
                400,
                'Bad Request'
            )
        );

    // 2. update user document
    console.log(req.user.id);
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: '200 ok',
        data: updatedUser,
    });
});

exports.delete_profile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'Deleted',
        data: null,
    });
});
