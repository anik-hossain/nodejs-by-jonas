const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, clbk) => {
//         clbk(null, 'public/img/users');
//     },
//     filename: (req, file, clbk) => {
//         const ext = file.mimetype.split('/')[0];
//         clbk(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, clbk) => {
    if (file.mimetype.startsWith('image')) {
        clbk(null, true);
    } else {
        clbk(
            new AppError('Not an image! Please upload only images.', 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// Upload User Image
exports.uploadAvatar = upload.single('photo');

// Resize Image
exports.resizeImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});

const filterObj = (obj, ...allowedField) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedField.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
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
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3. Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: 200,
        data: updatedUser,
        isUploaded: req.file ? true : false,
    });
});

exports.delete_profile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'Deleted',
        data: null,
    });
});
