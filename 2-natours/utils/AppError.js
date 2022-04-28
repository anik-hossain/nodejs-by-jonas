class AppError extends Error {
    constructor(message, statusCode, statusExplanation) {
        super(message);
        this.statusCode = statusCode;
        this.statusExplanation = statusExplanation;
        this.status = `${statusCode}`.startsWith('4')
            ? statusExplanation
            : 'Error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
