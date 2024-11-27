const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Lấy sản phẩm theo tên
router.get('/name/:productName', productController.getProductByName);

router.get('/product-review/:productId', productController.getProductReview);

router.post('/upload-product-review', productController.uploadProductReview);
module.exports = router;
