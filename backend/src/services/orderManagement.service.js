const db = require("../db");
const getOrderDetailForCustomer = async (userId) => {
  const [orderDetails] = await db.query("SELECT * FROM orders WHERE customer_id = ?", [
    userId,
  ]);
  return orderDetails;
};

module.exports = {
  getOrderDetailForCustomer,
};
