const orderManagementService = require("../services/orderManagement.service");
const getOrderDetailForCustomer = async (req, res) => {
  const userId = req.body.userId;
  const orderDetails = await orderManagementService.getOrderDetailForCustomer(
    userId
  );
  res.status(200).json({ orderDetails });
};

const getLatestOrder = async (req, res) => {
  const { itemPerPage, pageNumber } = req.params;
  const getLatestOrderItems = await orderManagementService.getLatestOrder({
    itemPerPage,
    pageNumber,
  });
  res.status(200).json({ getLatestOrderItems });
};
module.exports = {
  getOrderDetailForCustomer,
  getLatestOrder,
};
