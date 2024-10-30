const express = require("express");
const adminRoute = require("./routes/admin.route");
const customerRoute = require("./routes/customer.route");
const router = express.Router();
const paymentRoutes = require("./routes/payment.route");
const orderRoutes = require('./routes/order.route');


router.use('/api/orders', orderRoutes);
router.use("/api/payments", paymentRoutes);
router.use("/admin", adminRoute);
router.use("/customer", customerRoute);

module.exports = router;
