const express = require("express")
const orderController = require("../controllers/orderController")

const router = express.Router();
router.get('/all', orderController.getAllOrders); 

router.post('/create-order', orderController.createOrder);
router.get('/user/:userId', orderController.getOrdersByUserId); 
router.get('/:id', orderController.getOrderById);
module.exports = router;