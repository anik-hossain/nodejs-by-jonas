/**
 * Dependencies
 */

require('colors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

const errorController = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

/**
 * Create Application
 */
const app = express();

app.enable('trust proxy');

// Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware

// Implement CORS
app.use(cors());

// Serving static file
app.use(express.static(path.join(__dirname, 'public')));

// Security Http Headers
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// Development logging
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : null;

// Limit request from api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request form this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

// Compress Response
app.use(compression());

// Routing
app.use('/', viewRouter);
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use('/api/v1/bookings/', bookingRoutes);

// 404 Route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
