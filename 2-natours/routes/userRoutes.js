const express = require('express');
const { signup } = require('../controllers/authController');
const {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
