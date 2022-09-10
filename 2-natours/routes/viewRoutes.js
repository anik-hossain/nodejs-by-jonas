const express = require('express');
const { isLoggedIn, protect } = require('../controllers/authController');
const {
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    updateUserData,
} = require('../controllers/viewsController');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/tours/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);

router.post('/update-user-data', protect, updateUserData);

module.exports = router;
