const express = require('express');

const router = express.Router();
const OrdersController = require('../controllers/orders');
const checkAuth = require('../middleware/check-auth');


router.get('/', checkAuth, OrdersController.orders_get_all);

router.get('/:orderId', checkAuth, OrdersController.orders_get_one);

router.post('/', checkAuth, OrdersController.orders_create_one);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_one);

module.exports = router;
