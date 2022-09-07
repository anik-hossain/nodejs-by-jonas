const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

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
