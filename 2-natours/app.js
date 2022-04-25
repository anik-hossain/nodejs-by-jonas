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
app.use(morgan('dev'));
app.use(express.json());

// Routing
app.use('/api/v1/tours/', tourRoutes);
app.use('/api/v1/users/', userRoutes);

module.exports = app;
