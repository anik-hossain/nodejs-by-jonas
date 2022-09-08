const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const newDoc = await Model.create(req.body);
        res.status(201).json({
            status: 'Created Successfully',
            data: {
                data: newDoc,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(
                new AppError(
                    'No document found whit that ID',
                    404,
                    '404 Not Found'
                )
            );
        }

        res.status(200).json({
            status: 'Success',
            data: {
                data: doc,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        // Adding a nested GET endpoint for reviews on tour
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        // const doc = await features.query.explain();
        const doc = await features.query;

        // Response to client
        res.status(200).json({
            status: 'Success',
            result: doc.length,
            data: {
                data: doc,
            },
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(
                new AppError('No doc found whit that ID', 400, 'Bad Request')
            );
        }
        res.status(200).json({
            status: 'Success',
            message: 'Updated successfully',
            data: doc,
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(
                new AppError(
                    'No document found whit that ID',
                    400,
                    'Bad Request'
                )
            );
        }
        res.status(204).json({
            status: 'Success',
            data: null,
            message: 'Successfully Deleted',
        });
    });
