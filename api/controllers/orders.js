const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.orders_get_all = (req, res) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
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
};

exports.orders_get_one = (req, res) => {
  Order.findById(req.params.orderId)
    .populate('product', 'name')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({
        order,
        reguest: {
          type: 'GET',
          url: `http://localhost:8081/order`,
        },
      });
      return true;
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.orders_create_one = (req, res) => {
  Product.findById(req.body.productId).then(product => {
    if (!product) {
      return res.status(404).json({ message: 'Product not found ' });
    }
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });
    return order
      .save()
      .then(result => {
        res.status(201).json({
          message: 'Order stored',
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: 'GET',
            url: `http://localhost:8081/${result._id}`,
          },
        });
      })
      .catch(err =>
        res.status(500).json({
          message: 'Product not found',
          error: err,
        }),
      );
  });
};

exports.orders_delete_one = (req, res) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Order deleted',
        reguest: {
          type: 'POST',
          url: `http://localhost:8081/order`,
          body: { productId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
