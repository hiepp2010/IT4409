const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

router.post('/initiate', PaymentController.initiatePayment);

module.exports = router;
