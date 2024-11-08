const db = require("../db");
const getOrderDetailForCustomer = async (userId) => {
  const [orderDetails] = await db.query(
    "SELECT * FROM orders WHERE customer_id = ?",
    [userId]
  );
  return orderDetails;
};

const getLatestOrder = async ({ itemPerPage, pageNumber }) => {
  const offset = (pageNumber - 1) * itemPerPage;
  const [getLatestOrderItems] = await db.query(
    "SELECT * FROM orders ORDER BY createdAt DESC LIMIT ? OFFSET ?",
    [itemPerPage, offset]
  );
  return getLatestOrderItems;
};

module.exports = {
  getOrderDetailForCustomer,
  getLatestOrder,
};
