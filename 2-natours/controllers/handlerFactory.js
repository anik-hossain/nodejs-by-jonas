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
