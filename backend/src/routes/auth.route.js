const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth.controller');

// for users
//router.post("/user/login", authController.userLogin);
router.post("/user/register", authController.userRegister);
//router.post("/user/logout", authController.userLogout);

// for admin
//router.post("/admin/login", authController.adminLogin);
router.post("/admin/register", authController.adminRegister);
//router.post("/admin/logout", authController.adminLogout);

module.exports = router;
