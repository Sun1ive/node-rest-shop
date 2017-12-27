const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const MONGO_ATLAS_PW = 'd1abl0';

mongoose.connect(
  `mongodb://node-shop:${MONGO_ATLAS_PW}@node-rest-shop-shard-00-00-3xfy1.mongodb.net:27017,node-rest-shop-shard-00-01-3xfy1.mongodb.net:27017,node-rest-shop-shard-00-02-3xfy1.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin`,
  {
    useMongoClient: true,
  },
);
mongoose.Promise = global.Promise;

// using morgan package for logging
app.use(morgan('dev'));

// using bodyParser included in express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// add cors
app.use(cors());

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
