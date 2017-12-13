const express = require('express');

const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling get request to /products',
  });
});

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Handling POST request to /products',
        createdProduct: result,
      });
    })
    .catch(e => {
      res.send(500).json({ error: e });
    });

  res.status(201).json({
    message: 'Handling POST request to /products',
    createdProduct: product,
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(document => {
      console.log(document);
      res.status(200).json(document);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'updated product!',
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'deleted product!',
  });
});

module.exports = router;
