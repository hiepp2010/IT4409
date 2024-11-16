const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

router.post('/initiate', PaymentController.initiatePayment);

router.post('/create_payment_url', PaymentController.createPaymentUrl);
module.exports = router;
