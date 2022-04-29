const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
    createTour,
    deleteTour,
    getAllTours,
    getTour,
    updateTour,
    getTourStats,
    getMonthlyPlan,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
