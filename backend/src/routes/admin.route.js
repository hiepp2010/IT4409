const express = require("express");
const router = express.Router();
const multer = require("multer");

const authController = require("../controllers/auth.controller");
const categoryControllers = require("../controllers/category.controller");
const productController = require("../controllers/product.controller");
const orderManagementController = require("../controllers/orderManagement.controller");

const upload = multer({ storage: multer.memoryStorage() });
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
router.post(
  "/product/createProduct",
  upload.single("image"),
  productController.createProduct
);
router.post(
  "/product/editProduct",
  upload.single("image"),
  productController.editProduct
);
router.post("/product/deleteProduct", productController.deleteProduct);
// lấy order detail với orderId được truyền trong params
router.get(
  "/orderDetail/:orderId",
  orderManagementController.getOrderDetailByOrderIdForAdmin
);
// api phân trang về các order gần nhất
router.post("/lastest-order", orderManagementController.getLatestOrder);
// api update status order
router.post(
  "/orderDetail/updateOrderStatus",
  orderManagementController.updateOrderStatus
);

// api get 10 best seller với optionType gồm [week, month, year]
router.get(
  "/get-best-sellers/:timeFilter",
  orderManagementController.getBestSellers
);

// get revenue 10 mốc gần nhất
router.get(
  "/get-revenue/:timeFilter",
  orderManagementController.getRevenueStatistics
);

router.get("/order-statistics/:timeFilter", orderManagementController.getOrderStatistics)
module.exports = router;
