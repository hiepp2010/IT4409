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




// // Hàm sinh mã đơn hàng dựa trên timestamp
// const generateOrderNo = () => {
//   const timestamp = Date.now(); // Lấy thời gian hiện tại
//   return `ORD${timestamp}`; // Ghép tiền tố "ORD" với timestamp
// };

// const createOrder = async ({
//   customerId,
//   items,
//   totalAmount,
//   paymentMethod,
//   totalDiscount = 0,
//   address,
//   phoneNumber,
// }) => {
//   try {
//       // Kiểm tra address và phoneNumber
//       if (!address || !phoneNumber) {
//           const [customerInfo] = await pool.query(
//               "SELECT * FROM users WHERE user_id = ?",
//               [customerId]
//           );

//           if (
//               !customerInfo ||
//               !_.get(customerInfo, "address") ||
//               !_.get(customerInfo, "phone_number")
//           ) {
//               throw new Error(
//                   "Missing address or phone number to order successfully!"
//               );
//           }

//           address = _.get(customerInfo, "address");
//           phoneNumber = _.get(customerInfo, "phone_number");
//       }

//       // Sinh mã đơn hàng
//       const orderNo = generateOrderNo();

//       // Tạo đơn hàng mới trong bảng orders
//       const [result] = await pool.query(
//           `INSERT INTO orders (orderNo, customer_id, total_amount, payment_method, status, total_discount, address, phone_number) 
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//           [
//               orderNo,
//               customerId,
//               totalAmount,
//               paymentMethod,
//               "pending",
//               totalDiscount,
//               address,
//               phoneNumber,
//           ]
//       );

//       const orderId = result.insertId; // ID đơn hàng vừa được tạo

//       // Lưu từng mục trong đơn hàng vào bảng order_items
//       for (const item of items) {
//           await db.query(
//               "INSERT INTO order_items (order_id, product_id, quantity, price, payment_amount) VALUES (?, ?, ?, ?, ?)",
//               [
//                   orderId,
//                   item.productId,
//                   item.quantity,
//                   item.price,
//                   item.price * item.quantity,
//               ]
//           );
//       }

//       // Trả về thông tin đơn hàng
//       return {
//           id: orderId,
//           orderNo, // Mã đơn hàng
//           customerId,
//           totalAmount,
//           paymentMethod,
//           totalDiscount,
//           address,
//           phoneNumber,
//           items,
//       };
//   } catch (error) {
//       console.error("Error creating order:", error);
//       throw error;
//   }
// };



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