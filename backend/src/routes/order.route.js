const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');


router.post('/create', OrderController.createOrder);
router.get('/id/:orderId', OrderController.getOrderById);

module.exports = router;
