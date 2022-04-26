const Tour = require('../models/tourModel');

// Get all tours
exports.getAllTours = async (req, res) => {
    try {
        // 1.1 - Filtering
        const queryObj = { ...req.query };
        const excludedField = ['page', 'sort', 'limit', 'fields'];
        excludedField.forEach((el) => delete queryObj[el]);

        // 1.2 - Advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        let query = Tour.find(JSON.parse(queryStr));

        // 2 - Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('createdAt');
        }

        // 3 - Field limited
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Execute query
        const tours = await query;

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
