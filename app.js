const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan'); // it show the information about the request
const rateLimit = require('express-rate-limit');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  //the app will use this middleware to print the information about the request only in development environment
  app.use(morgan('dev'));
}
app.use(express.json());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use(limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2) ROUTE HANDELERS

app.use('/api/v1/tours', tourRouter); //use tourRouter to point to this url
app.use('/api/v1/users', userRouter); //use userouter to point to this url

// handling unhandled reoutes

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404)); //whaen we call next with an argument the express knows there is an error occurs
});

//when error occurs express jump to this error handling middleware
app.use(globalErrorHandler);

module.exports = app;
