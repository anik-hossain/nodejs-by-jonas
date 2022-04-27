module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 5000;
    err.status = err.status || 'Server side error occurred';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
