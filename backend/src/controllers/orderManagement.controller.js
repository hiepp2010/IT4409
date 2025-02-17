const orderManagementService = require("../services/orderManagement.service");
const getOrderDetailForCustomer = async (req, res) => {
  const userId = req.body.userId;
  const orderDetails = await orderManagementService.getOrderDetailForCustomer(
    userId
  );
  res.status(200).json({ orderDetails });
};

const getLatestOrder = async (req, res) => {
  const { itemPerPage, pageNumber } = req.body;
  const getLatestOrderItems = await orderManagementService.getLatestOrder({
    itemPerPage,
    pageNumber,
  });
  res.status(200).json({ getLatestOrderItems });
};

const getOrderDetailByOrderIdForAdmin = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderDetail =
      await orderManagementService.getOrderDetailByOrderIdForAdmin(orderId);
    res.status(200).json(orderDetail); // Trả về kết quả cho client
  } catch (err) {
    res.status(500).json({ error: `Cannot get order detail: ${err.message}` });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderManagementService.updateOrderStatus(orderId, status);
    res.status(200).json("Update order status successfully!");
  } catch (err) {
    res
      .status(500)
      .json({ error: `Update order status failed !: ${err.message}` });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const { timeFilter } = req.params;
    const result = await orderManagementService.getBestSellers(timeFilter);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Get best sellers failed !: ${err.message}` });
  }
};

const getRevenueStatistics = async (req, res) => {
  const { timeFilter } = req.params;
  try {
    const results = await orderManagementService.getRevenueStatistics(
      timeFilter
    );
    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Get revenue statistics failed !: ${err.message}` });
  }
};

const getOrderStatistics = async (req, res) => {
  const { timeFilter } = req.params;
  try {
    const result = await orderManagementService.getOrderStatistics(
      timeFilter
    );
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Get order statistics failed !: ${err.message}` });
  }
};
module.exports = {
  getOrderDetailForCustomer,
  getLatestOrder,
  getOrderDetailByOrderIdForAdmin,
  updateOrderStatus,
  getBestSellers,
  getRevenueStatistics,
  getOrderStatistics,
};
