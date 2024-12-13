const OrderService = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    // Extract IP Address
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "127.0.0.1";
    // Gọi service để xử lý logic tạo đơn hàng
    const result = await OrderService.createOrder(orderData, ipAddr);

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
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getPaymentResponseByIPNFromVnpay = async (req, res) => {
  try {
    await OrderService.getPaymentResponseByIPNFromVnpay(req);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err });
  }
};
module.exports = {
  createOrder,
  getOrderById,
  getPaymentResponseByIPNFromVnpay,
};
