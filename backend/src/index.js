const express = require("express");
const authRoute = require('./routes/auth.route')
const fetchRoute = require('./routes/fetch.route')
const router = express.Router();

router.use('/auth',authRoute);
router.use('/fetch', fetchRoute);
module.exports = router;
