const express = require('express');
const morgan = require('morgan');

const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// using morgan package for logging
app.use(morgan('dev'));


// using bodyParser included in express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
