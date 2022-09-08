const express = require('express');
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
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

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', protect, getMe, getUser);
router.post('/forgot', forgotPassword);
router.patch('/password-reset/:token', resetPassword);
router.patch('/update-password', protect, updatePassword);
router.patch('/update-profile', protect, update_profile);
router.delete('/delete-profile', protect, delete_profile);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
