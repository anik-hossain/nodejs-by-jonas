const express = require('express');

const { protect, restrictTo } = require('../controllers/authController');
const {
    getAllReviews,
    createReview,
} = require('../controllers/reviewController');

// MergeParams enable for nested routes
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview);

module.exports = router;
