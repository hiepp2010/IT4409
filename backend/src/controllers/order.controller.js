const OrderService = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const {
      customer_id,
      payment_method,
      total_amount,
    } = orderData;


    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "127.0.0.1";

    const result = await OrderService.createOrder(orderData, ipAddr);
    if (payment_method === "COD") {
      res.status(201).json({
        message: "Đơn hàng tạo thành công.",
        orderNo: result.orderNo,
      });
    }

    if (payment_method === "VNPAY") {
      const paymentUrl = await OrderService.paymentWithVnpay({
        total_amount,
        customer_id,
        ipAddr,
      });
      res.redirect(paymentUrl);
    }
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
