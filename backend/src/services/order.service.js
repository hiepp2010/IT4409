const db = require("../db");
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment");

const _sortObject = (obj) => {
  let sorted = {};
  let keys = Object.keys(obj).sort(); // Get and sort keys alphabetically
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
};

const _paymentWithVnpay = async ({ total_amount, customer_id, req }) => {
  try {
    // Extract IP Address
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "127.0.0.1";

    const tmnCode = "N9ZU3Q90"; // Replace with your actual TMN code
    const secretKey = "G15YSOY3R1T0O7LNCPUXY9K6D1KEF48K"; // Replace with your actual secret key
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = "https://www.messenger.com/e2ee/t/9032429510123061"; // TODO

    // Generate timestamps
    const date = moment();
    const createDate = date.format("yyyymmddHHMMss");
    const orderId = date.format("HHMMss");

    const amount = total_amount; // Assuming total_amount is in VND
    const orderInfo = `Thanh toan cho khach hang ${customer_id}`;
    const orderType = "200000"; // Replace with appropriate order type code
    const locale = "vn"; // Locale (e.g., "vn" for Vietnamese)
    const currCode = "VND"; // Currency code

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100, // Convert to smallest currency unit
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sort parameters and create query string
    vnp_Params = _sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, {
      encode: false,
    })}`;

    return paymentUrl; // Return the generated VNPay payment URL
  } catch (error) {
    console.error("Error in _paymentWithVnpay:", error);
    throw new Error("Payment generation failed.");
  }
};

const getPaymentResponseByIPNFromVnpay = async (req) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  const orderId = vnp_Params["vnp_TxnRef"];
  const rspCode = vnp_Params["vnp_ResponseCode"];

  // Xóa checksum để kiểm tra chữ ký
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sắp xếp các tham số
  const sortedParams = _sortObject(vnp_Params);

  const secretKey = "G15YSOY3R1T0O7LNCPUXY9K6D1KEF48K";
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Kiểm tra tính hợp lệ của chữ ký
  if (secureHash !== signed) {
    throw new Error("Checksum failed");
  }

  // Kiểm tra các điều kiện đơn hàng
  const paymentStatus = "0"; // Giả định trạng thái ban đầu của đơn hàng
  const checkOrderId = true; // Kiểm tra đơn hàng tồn tại
  const checkAmount = true; // Kiểm tra số tiền khớp

  if (!checkOrderId) {
    throw new Error("Order not found");
  }

  if (!checkAmount) {
    throw new Error("Amount invalid");
  }

  if (paymentStatus !== "0") {
    throw new Error("This order has already been updated");
  }

  if (rspCode === "00") {
    // Thanh toán thành công
    // Cập nhật trạng thái đơn hàng trong database tại đây
    return { RspCode: "00", Message: "Success" };
  } else {
    // Thanh toán thất bại
    // Cập nhật trạng thái thất bại trong database tại đây
    return { RspCode: "00", Message: "Transaction failed" };
  }
};

const createOrder = async (orderData) => {
  const {
    customer_id,
    phone_number,
    address,
    payment_method = "COD",
    items,
  } = orderData;

  if (
    !customer_id ||
    !phone_number ||
    !address ||
    !items ||
    items.length === 0
  ) {
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
    if (payment_method === "VNPAY") {
      await _paymentWithVnpay({ total_amount });
    }
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Lưu thông tin đơn hàng vào bảng Orders
    const [orderResult] = await connection.query(
      "INSERT INTO Orders (status, total_amount, total_discount, payment_method, orderNo, phone_number, address, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Processing",
        total_amount,
        total_discount,
        payment_method,
        orderNo,
        phone_number,
        address,
        customer_id,
      ]
    );

    const order_id = orderResult.insertId;

    // Lưu các sản phẩm vào bảng Order_Items
    for (const item of items) {
      const { product_id, quantity, price, discount_id, discount_amount } =
        item;

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
    const [rows] = await db.query("SELECT * FROM orders WHERE orderNo = ?", [
      orderId,
    ]);
    return rows[0]; // Trả về đơn hàng đầu tiên
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrder,
  findOrderById,
  _paymentWithVnpay,
  getPaymentResponseByIPNFromVnpay,
};
