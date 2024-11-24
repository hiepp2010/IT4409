const OrderService = require("../services/order.service");
const PaymentController = require("./payment.controller");

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Gọi service để xử lý logic tạo đơn hàng
    const result = await OrderService.createOrder(orderData);

    res.status(201).json({
      message: "Đơn hàng tạo thành công.",
      orderNo: result.orderNo,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({
      message: "Lỗi khi tạo đơn hàng.",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
      const { orderId } = req.params;
      const order = await OrderService.findOrderById(orderId);
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createOrder,
  getOrderById,
};
