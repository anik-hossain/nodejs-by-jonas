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

const handleJwtError = () =>
    new AppError('Invalid token. Please log in again', 401, 'Unauthorized');
const handleJwtExpireError = () =>
    new AppError(
        'Your token has expired. Please log in again',
        401,
        'Unauthorized'
    );

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
    });
};

const sendErrorProduction = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // Programming or other unknown error: don't leak error details in client

        console.error('Error 😡', err);

        return res.status(500).json({
            status: 'Server side error',
            message: 'Something went wrong in server',
        });
    }
    // Operational, trusted error: send to client
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }
    // Programming or other unknown error: don't leak error details in client
    console.error('Error 😡', err);

    return res.status(500).json({
        status: 'Something went wrong',
        message: 'Please try again later',
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Server side error occurred';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJwtError();
        if (error.name === 'TokenExpiredError') error = handleJwtExpireError();

        sendErrorProduction(error, req, res);
    }
};
