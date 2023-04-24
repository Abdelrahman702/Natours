const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan'); // it show the information about the request
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  //the app will use this middleware to print the information about the request only in development environment
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next(); //it is necessery to call it
});

// 2) ROUTE HANDELERS

app.use('/api/v1/tours', tourRouter); //use tourRouter to point to this url
app.use('/api/v1/users', userRouter); //use userouter to point to this url

// handling unhandled reoutes

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.statusCode = 404;
  err.status = 'fail';
  next(err); //whaen we call next with an argument the express knows there is an error occurs
});

//when error occurs express jump to this error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
