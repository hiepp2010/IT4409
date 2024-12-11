const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

router.post('/initiate', PaymentController.initiatePayment);
router.post('/get-delivery-fee', PaymentController.getDeliveryFee);
module.exports = router;
