const express = require("express");
const adminRoute = require("./routes/admin.route");
const customerRoute = require("./routes/customer.route");
const router = express.Router();
const paymentRoutes = require("./routes/payment.route");
const orderRoutes = require('./routes/order.route');
const productRoutes = require("./routes/product.route");

router.use('/orders', orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoute);
router.use("/customer", customerRoute);
router.use('/api/products', productRoutes);

module.exports = router;
