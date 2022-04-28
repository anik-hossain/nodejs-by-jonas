const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        lowerCase: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    photo: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
