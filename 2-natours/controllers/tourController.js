const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();

    const tours = await features.query;

    // Response to client
    res.status(200).json({
        status: 'Success',
        result: tours.length,
        data: {
            tours,
        },
    });
});

// Get tour by id
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found whit that ID', 404));
    }

    res.status(200).json({
        status: 'Success',
        data: {
            tour,
        },
    });
});

// Create new tour
exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            tour: newTour,
        },
    });
});

// Update tour
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return next(new AppError('No tour found whit that ID', 400));
    }
    res.status(200).json({
        status: 'Success',
        message: 'Updated successfully',
        tour,
    });
});

// Delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found whit that ID', 400));
    }
    res.status(204).json({
        status: 'Success',
        data: null,
        message: 'Successfully Deleted',
    });
});

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
