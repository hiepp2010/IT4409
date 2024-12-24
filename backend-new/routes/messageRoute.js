const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/', messageController.fetchMessageHistory);
router.get('/customers', messageController.fetchCustomer);

module.exports = router;
