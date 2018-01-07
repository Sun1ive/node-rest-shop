const Order = require('../models/order');

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
}