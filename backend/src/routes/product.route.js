const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Lấy sản phẩm theo tên
router.get('/name/:productName', productController.getProductByName);

module.exports = router;
