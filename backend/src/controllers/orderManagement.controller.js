const orderManagementService = require("../services/orderManagement.service");
const getOrderDetailForCustomer = async (req, res) => {
  const userId = req.body.userId;
  const orderDetails = await orderManagementService.getOrderDetailForCustomer(userId);
  res.status(200).json({ orderDetails });
};

module.exports = {
  getOrderDetailForCustomer,
};
