const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password are not the same',
        },
    },
    passwordChangedAt: Date,
    photo: String,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return jwtTimeStamp < changedTimestamp;
    }
    // False means not changed
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
