const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400, 'Bad Request');
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate fields value: ${value}. Please use another value!`;
    return new AppError(message, 400, 'Bad Request');
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data ${errors.join('. ')}`;
    return new AppError(message, 400, 'Bad Request');
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProduction = (err, res) => {
    // Operational, trusted error: send to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Programming or other unknown error: don't leak error details in client
    else {
        console.error('Error 😡', err);

        res.status(500).json({
            status: 'Server side error',
            message: 'Something went wrong in server',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Server side error occurred';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        sendErrorProduction(error, res);
    }
};
