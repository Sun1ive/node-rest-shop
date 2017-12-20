const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .exec()
    .then(result => {
      res.status(200).json({
        count: result.length,
        orders: result.map(doc => ({
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:8081/${doc._id}`,
          },
        })),
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });
  order
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'order details',
    orderId: req.params.orderId,
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'order deleted',
    orderId: req.params.orderId,
  });
});

module.exports = router;
