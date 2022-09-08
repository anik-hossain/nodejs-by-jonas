const Tour = require('../models/tourModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} = require('./handlerFactory');

// Get all tours
exports.getAllTours = getAll(Tour);

// Get tour by id
exports.getTour = getOne(Tour, { path: 'reviews' });

// Create new tour
exports.createTour = createOne(Tour);

// Update tour
exports.updateTour = updateOne(Tour);

// Delete tour
exports.deleteTour = deleteOne(Tour);

// Get tour stats
exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 },
            },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
        // {
        //     $match: {
        //         _id: { $ne: 'EASY' },
        //     },
        // },
    ]);
    // Response to client
    res.status(200).json({
        status: 'Success',
        data: {
            stats,
        },
    });
});

// Monthly plan
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = parseInt(req.params.year);
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 100,
        },
    ]);
    // Response to client
    res.status(200).json({
        status: 'Success',
        data: {
            plan,
        },
    });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng.',
                400
            )
        );
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
        message: 'Success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});
