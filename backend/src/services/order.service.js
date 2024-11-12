const db = require("../db");
const _ = require("lodash");
const createOrder = async ({
  customerId,
  items,
  totalAmount,
  paymentMethod,
  totalDiscount = 0,
  address,
  phoneNumber,
}) => {
  if (!address || !phoneNumber) {
    const [customerInfo] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [customerId]
    );

    if (
      !customerInfo ||
      !_.get(customerInfo, "address") ||
      !_.get(customerInfo, "phone_number")
    ) {
      throw new Error("Missing address or phone number to order successfully!");
    }
    address = _.get(customerInfo, "address");
    phoneNumber = _.get(customerInfo, "phone_number");
  }
  // Tạo đơn hàng mới trong bảng orders
  const orderId = await new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO orders (customer_id, total_amount, payment_method, status, total_discount, address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        totalAmount,
        paymentMethod,
        "pending",
        totalDiscount,
        address,
        phoneNumber,
      ],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID); // Lấy order_id vừa được tạo
      }
    );
  });

  // Lưu từng mục trong đơn hàng vào bảng order_items
  for (const item of items) {
    await db.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price, payment_amount) VALUES (?, ?, ?, ?, ?)",
      [
        orderId,
        item.productId,
        item.quantity,
        item.price,
        item.price * item.quantity,
      ]
    );
  }

  // Trả về chi tiết đơn hàng
  return { id: orderId, customerId, totalAmount, paymentMethod, items };
};
module.exports = {
  createOrder,
};
