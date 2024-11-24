const db = require("../db");

const createOrder = async (orderData) => {
  const { customer_id, phone_number, address, payment_method = "COD", items } = orderData;

  if (!customer_id || !phone_number || !address || !items || items.length === 0) {
    throw new Error("Thông tin đơn hàng không hợp lệ.");
  }

  const orderNo = `ORD${Date.now()}`; // Sinh mã đơn hàng
  let total_amount = 0;
  let total_discount = 0;

  // Tính tổng tiền và tổng giảm giá
  items.forEach((item) => {
    const { price, quantity, discount_amount } = item;
    total_amount += price * quantity;
    total_discount += discount_amount ? discount_amount * quantity : 0;
  });

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Lưu thông tin đơn hàng vào bảng Orders
    const [orderResult] = await connection.query(
      "INSERT INTO Orders (status, total_amount, total_discount, payment_method, orderNo, phone_number, address, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      ["Processing", total_amount, total_discount, payment_method, orderNo, phone_number, address, customer_id]
    );

    const order_id = orderResult.insertId;

    // Lưu các sản phẩm vào bảng Order_Items
    for (const item of items) {
      const { product_id, quantity, price, discount_id, discount_amount } = item;

      await connection.query(
        "INSERT INTO Order_Items (discount_id, product_id, order_id, payment_amount, price, discount_amount, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          discount_id || null,
          product_id,
          order_id,
          price * quantity - (discount_amount || 0),
          price,
          discount_amount || 0,
          quantity,
        ]
      );

      // Cập nhật tồn kho trong bảng Products
      await connection.query(
        "UPDATE Products SET stock_quantity = stock_quantity - ? WHERE product_id = ?",
        [quantity, product_id]
      );
    }

    await connection.commit();

    return { orderNo };
  } catch (error) {
    if (connection) await connection.rollback();
    throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
  } finally {
    if (connection) connection.release();
  }
};

const findOrderById = async (orderId) => {
  try {
      const [rows] = await db.query('SELECT * FROM orders WHERE orderNo = ?', [orderId]);
      return rows[0]; // Trả về đơn hàng đầu tiên
  } catch (error) {
      throw error;
  }
};

module.exports = {
  createOrder,
  findOrderById,
};