const express = require("express");
const adminRoute = require("./routes/admin.route");
const customerRoute = require("./routes/customer.route");
const router = express.Router();

router.use("/admin", adminRoute);
router.use("/customer", customerRoute);

module.exports = router;
