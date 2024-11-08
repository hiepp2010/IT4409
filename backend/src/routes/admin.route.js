const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const categoryControllers = require("../controllers/category.controller");
const productController = require("../controllers/product.controller");
const orderManagementController = require("../controllers/orderManagement.controller")
// for admin
router.post("/login", authController.adminLogin);
router.post("/register", authController.adminRegister);
router.post("/logout", authController.logout);

router.get(
  "/category/:categoryName",
  categoryControllers.fetchItemByCategoryName
);

// fetch thông tin về sản phẩm, phần body chứa productName
router.post("/product/fetchProduct", productController.fetchProduct);
router.post("/product/createProduct", productController.createProduct);
router.post("/product/editProduct", productController.editProduct);
router.post("product/deleteProduct", productController.deleteProduct);

// api phân trang về các order gần nhất
router.post("/lastest-order", orderManagementController.getLatestOrder);
module.exports = router;
