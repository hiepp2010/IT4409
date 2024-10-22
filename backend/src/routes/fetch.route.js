const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/category.controller");
const productController = require("../controllers/product.controller");
// fetch thông tin bằng categoryName
router.get(
  "/category/:categoryName",
  categoryControllers.fetchItemByCategoryName
);

// fetch thông tin về sản phẩm, phần body chứa productName
router.post("/product", productController.fetchProduct);

// fetch thông tin sản phẩm mới
module.exports = router;
