const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const mongoose = require('mongoose');

mongoose.connect(
  `mongodb://node-shop:${
    process.env.MONGO_ATLAS_PW
  }@node-rest-shop-shard-00-00-3xfy1.mongodb.net:27017,node-rest-shop-shard-00-01-3xfy1.mongodb.net:27017,node-rest-shop-shard-00-02-3xfy1.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin`,
  {
    useMongoClient: true,
  },
);

// using morgan package for logging
app.use(morgan('dev'));

// using bodyParser included in express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// add cors
app.use(cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');

//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     return res.status(200).json({});
//   }
//   next();
// });

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
