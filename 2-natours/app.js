/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorController = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/AppError');

/**
 * Create Application
 */
const app = express();

// Global Middleware
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : null;

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request form this IP, please try again in an hour!',
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routing
app.use('/api/v1/tours/', tourRoutes);
app.use('/api/v1/users/', userRoutes);

// 404 Route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
