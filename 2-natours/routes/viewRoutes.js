const express = require('express');
const { isLoggedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');
const {
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    updateUserData,
    getMyTours,
} = require('../controllers/viewsController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/tours/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/update-user-data', protect, updateUserData);

module.exports = router;
