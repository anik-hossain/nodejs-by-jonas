const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');

// Get all tours
exports.getAllTours = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'Not Found',
            message: error.message,
        });
    }
};

// Get tour by id
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Not found',
            message: 'Invalid id',
        });
    }
};

// Create new tour
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error.message,
        });
    }
};

// Update tour
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'Success',
            message: 'Updated successfully',
            tour,
        });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error.message,
        });
    }
};

// Delete tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'Success',
            data: null,
            message: 'Successfully Deleted',
        });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error.message,
        });
    }
};

// Monthly plan
exports.getTourStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error.message,
        });
        console.log(error);
    }
};

// Monthly plan
exports.getMonthlyPlan = async (req, res) => {
    try {
    } catch (error) {}
};
