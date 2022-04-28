const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'Ok',
        results: users.length,
        data: { users },
    });
});

// Get user by id
exports.getUser = (req, res) => {
    res.status(404).json({
        status: 'Error',
    });
};

// Create new user
exports.createUser = (req, res) => {
    res.status(201).json({
        status: 'Error',
    });
};

// Update user
exports.updateUser = (req, res) => {
    res.status(404).json({
        status: 'Error',
    });
};

// Delete user
exports.deleteUser = (req, res) => {
    res.status(404).json({
        status: 'Error',
    });
};
