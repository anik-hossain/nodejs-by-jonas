const express = require('express');

const { protect, restrictTo } = require('../controllers/authController');
const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
} = require('../controllers/reviewController');

// MergeParams enable for nested routes
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').patch(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
