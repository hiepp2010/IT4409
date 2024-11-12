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

const getBestSellers = async (timeFilter) => {
  let timeCondition = "";
  if (timeFilter === "week") {
    timeCondition = "AND o.created_at >= NOW() - INTERVAL '1 week'";
  } else if (timeFilter === "month") {
    timeCondition = "AND o.created_at >= NOW() - INTERVAL '1 month'";
  } else if (timeFilter === "year") {
    timeCondition = "AND o.created_at >= NOW() - INTERVAL '1 year'";
  }

  const query = `
     SELECT 
    oi.product_id, 
    oi.price,
    p.product_name,
    p.skucode,
    SUM(oi.quantity) AS total_quantity
    FROM 
    order_items oi
    JOIN 
    orders o ON oi.order_id = o.order_id
    JOIN 
    products p ON oi.product_id = p.product_id
    WHERE 
    o.status = 'completed'
    ${timeCondition}
    GROUP BY 
    oi.product_id, oi.price, p.product_name, p.skucode
    ORDER BY 
    total_quantity DESC
    LIMIT 10;
  `;

  try {
    const result = await db.query(query); // `db` là đối tượng kết nối cơ sở dữ liệu
    return result;
  } catch (error) {
    throw new Error("Error fetching top best sellers:", error);
  }
};

module.exports = {
  getOrderDetailForCustomer,
  getLatestOrder,
  getOrderDetailByOrderIdForAdmin,
  updateOrderStatus,
  getBestSellers,
};
