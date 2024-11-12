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
  switch (timeFilter) {
    case "week":
      timeCondition = `AND o.created_at >= DATE('now', '-7 days')`; // Lọc 1 tuần qua
      break;
    case "month":
      timeCondition = `AND o.created_at >= DATE('now', '-1 month')`; // Lọc 1 tháng qua
      break;
    case "year":
      timeCondition = `AND o.created_at >= DATE('now', '-1 year')`; // Lọc 1 năm qua
      break;
    default:
      throw new Error("Invalid time filter");
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
  LIMIT 10
`;

  try {
    const result = await db.query(query);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching top best sellers:", error);
  }
};

const getRevenueStatistics = async (timeFilter) => {
  try {
    let dateFormat;

    // Xác định định dạng ngày dựa trên timeFilter
    switch (timeFilter) {
      case "week":
        dateFormat = "%Y-%W"; // Format theo năm và số tuần
        break;
      case "month":
        dateFormat = "%Y-%m"; // Format theo năm và tháng
        break;
      case "year":
        dateFormat = "%Y"; // Format theo năm
        break;
      default:
        throw new Error("Invalid timeFilter. Use 'week', 'month', or 'year'.");
    }

    const query = `
      SELECT strftime('${dateFormat}', created_at) AS time_period,
             SUM(total_amount) AS revenue
      FROM orders
      GROUP BY time_period
      ORDER BY time_period DESC
      LIMIT 10
    `;

    const results = await db.query(query);
    return results;
  } catch (error) {
    throw new Error(`Error fetching revenue statistics: ${error}`);
  }
};
module.exports = {
  getOrderDetailForCustomer,
  getLatestOrder,
  getOrderDetailByOrderIdForAdmin,
  updateOrderStatus,
  getBestSellers,
  getRevenueStatistics,
};
