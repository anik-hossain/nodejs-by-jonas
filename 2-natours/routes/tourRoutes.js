const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const {
    createTour,
    deleteTour,
    getAllTours,
    getTour,
    updateTour,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
} = require('../controllers/tourController');

const router = express.Router();

// Nested Routes
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);
router
    .route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin);

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
