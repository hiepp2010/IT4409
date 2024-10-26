const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const categoryControllers = require("../controllers/category.controller");
const productController = require("../controllers/product.controller");

// for admin
router.post("/login", authController.adminLogin);
router.post("/register", authController.adminRegister);
router.post("/logout", authController.logout);

router.get(
  "/category/:categoryName",
  categoryControllers.fetchItemByCategoryName
);

// fetch thông tin về sản phẩm, phần body chứa productName
router.post("/product", productController.fetchProduct);

module.exports = router;
