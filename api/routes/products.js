const express = require('express');

const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `http://localhost:8081/products/${doc._id}`,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post('/', (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then(result => {
      res.status(200).json({
        message: 'Product created successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: `http://localhost:8081/products/${result._id}`,
          },
        },
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.get('/:productId', (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:8081/products',
          },
        });
      } else {
        res.status(404).json({ message: 'Not valid request' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res) => {
  const id = req.params.productId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(() =>
      res.status(200).json({
        message: 'Product updated!',
        request: {
          type: 'GET',
          url: `http://localhost:8081/products${id}`,
        },
      }),
    )
    .catch(err => res.status(500).json({ error: err }));
});

router.delete('/:productId', (req, res) => {
  const id = req.params.productId;

  Product.remove({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: `http://localhost:8081/products`,
          body: { name: 'String', price: 'Number' },
        },
      });
    })
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
