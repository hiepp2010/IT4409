const db = require("../db");
const getOrderDetailForCustomer = async (userId) => {
  const [orderDetails] = await db.query(
    "SELECT * FROM orders WHERE customer_id = ?",
    [userId]
  );
  return orderDetails;
};

const getLatestOrder = async ({ itemPerPage, pageNumber }) => {
  try {
    const offset = (pageNumber - 1) * itemPerPage;
    const getLatestOrderItems = await db.query(
      "SELECT * FROM orders ORDER BY order_id DESC LIMIT ? OFFSET ?",
      [itemPerPage, offset]
    );
    return getLatestOrderItems;
  } catch (err) {
    throw new Error(`Can not get latest orders ${err.message}`);
  }
};

const getOrderDetailByOrderIdForAdmin = async (orderId) => {
  try {
    const orderDetail = await db.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [orderId]
    );
    if (!orderDetail.length) {
      throw new Error("Invalid orderId!");
    }
    return orderDetail;
  } catch (err) {
    throw new Error(`Error when querying database: ${err.message}`);
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const orderDetail = await db.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [orderId]
    );
    if (!orderDetail.length) {
      throw new Error("Invalid orderId");
    }
    await db.query("UPDATE orders SET status = ? WHERE order_id = ?", [
      status,
      orderId,
    ]);
  } catch (err) {
    throw new Error(`Error when querying database: ${err.message}`);
  }
};

module.exports = {
  getOrderDetailForCustomer,
  getLatestOrder,
  getOrderDetailByOrderIdForAdmin,
  updateOrderStatus,
};
