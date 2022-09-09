const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1. Get Tour Data From Collection
    const tours = await Tour.find();

    // 2. Build Template
    // 3. Render That Template Using Tour Data From 1
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker',
    });
};
