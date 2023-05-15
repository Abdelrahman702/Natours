const path = require('path');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan'); // it show the information about the request
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitiza = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// by using express.static we basicly define that all the static assets will be always be served from  a folder called (puplic)
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) MIDDLEWARES

//Prevent parameter pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
    ], //to ALLOW DUPLICATES
  })
);

//Data sanitization against NOSQL queries

app.use(mongoSanitiza());

//Data sanitization against XSS

app.use(xss());

//Security for http header

app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  //the app will use this middleware to print the information about the request only in development environment
  app.use(morgan('dev'));
}

//Body parser , reading data from req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NOSQL query injection

//Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter); // set the limit for all routes

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2) ROUTE HANDELERS

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //use tourRouter to point to this url
app.use('/api/v1/users', userRouter); //use userouter to point to this url
app.use('/api/v1/reviews', reviewRouter);

// handling unhandled reoutes

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404)); //whaen we call next with an argument the express knows there is an error occurs
});

//when error occurs express jump to this error handling middleware
app.use(globalErrorHandler);

module.exports = app;
