const express = require('express');

const { protect, restrictTo } = require('../controllers/authController');
const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview,
} = require('../controllers/reviewController');

// MergeParams enable for nested routes
const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
