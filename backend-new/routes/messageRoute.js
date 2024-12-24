const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/fetch-message-history', messageController.fetchMessageHistory);

module.exports = router;
