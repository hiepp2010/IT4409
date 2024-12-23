const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const categoryControllers = require("../controllers/category.controller");
const productController = require("../controllers/product.controller");
const cartController = require("../controllers/cart.controller");
const orderManagementController = require("../controllers/orderManagement.controller");
const customerController = require("../controllers/customer.controller");
// for customers
router.post("/login", authController.userLogin);
router.post("/register", authController.userRegister);
router.post("/logout", authController.logout);

router.get(
  "/category/:categoryName",
  categoryControllers.fetchItemByCategoryName
);

// fetch thông tin về sản phẩm, phần body chứa productName
router.post("/product", productController.fetchProduct);

// thêm sản phẩm vào giỏ hàng
router.post("/addToCart", cartController.addToCart);
router.get('/getCart', cartController.getCart);

// quản lý đơn hàng
router.get("/order-management", orderManagementController.getOrderDetailForCustomer);

router.get('/', customerController.getAllCustomers);

router.get('/:userId/details', customerController.getCustomerDetails);
module.exports = router;
