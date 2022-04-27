/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

/**
 * Create Application
 */
const app = express();

// Middleware
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : null;
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routing
app.use('/api/v1/tours/', tourRoutes);
app.use('/api/v1/users/', userRoutes);

// 404 Route
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: '404 not found',
        message: `Can't find ${req.originalUrl} on this server`,
    });
});

module.exports = app;
