const express = require('express');
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo,
    logout,
} = require('../controllers/authController');
const {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    update_profile,
    delete_profile,
    getMe,
} = require('../controllers/userController');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot', forgotPassword);
router.patch('/password-reset/:token', resetPassword);

// Protect all routes after this middleware
router.use(protect);
router.patch('/update-password', updatePassword);
router.patch('/update-profile', update_profile);
router.delete('/delete-profile', delete_profile);
router.get('/me', getMe, getUser);

// Restrict all routes after this middleware
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
