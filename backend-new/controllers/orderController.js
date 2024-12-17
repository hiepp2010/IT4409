const { Product, OrderItem, OrderHistory } = require("../models/model");

const _sortObject = (obj) => {
  let sorted = {};
  let keys = Object.keys(obj).sort(); // Get and sort keys alphabetically
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
};

const paymentWithVnpay = async ({ total_amount, customer_id, ipAddr }) => {
  try {
    const tmnCode = "N9ZU3Q90"; // Replace with your actual TMN code
    const secretKey = "G15YSOY3R1T0O7LNCPUXY9K6D1KEF48K"; // Replace with your actual secret key
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = "https://it-4409-hjva.vercel.app";

    // Generate timestamps
    const date = moment();
    const createDate = date.format("yyyymmddHHMMss");
    const orderId = date.format("HHMMss");

    const amount = total_amount; // Assuming total_amount is in VND
    const orderInfo = `Thanh toan cho khach hang ${customer_id} gia tri ${total_amount}`;
    const orderType = "200000"; // mặt hàng thời trang
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
const createOrder = async (req, res) => {
  const {
    customer_id,
    phone_number,
    address,
    payment_method = "COD",
    items,
  } = req.body;

  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    "127.0.0.1";
  // Validation check
  if (
    !customer_id ||
    !phone_number ||
    !address ||
    !items ||
    items.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Thông tin đơn hàng không hợp lệ." });
  }

  const orderNo = `ORD${Date.now()}`; // Generate order number
  let total_amount = 0;
  let total_discount = 0;

  // Calculate total amount and total discount
  items.forEach((item) => {
    const { price, quantity, discount_amount } = item;
    total_amount += price * quantity;
    total_discount += discount_amount ? discount_amount * quantity : 0;
  });

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Create order in OrderHistory
    const order = await OrderHistory.create(
      {
        status: "Processing",
        totalAmount: total_amount,
        totalDiscount: total_discount,
        paymentMethod: payment_method,
        orderNo: orderNo,
        phoneNumber: phone_number,
        address: address,
        userId: customer_id,
      },
      { transaction } // Ensure this operation is part of the transaction
    );

    // Process each item in the order
    for (const item of items) {
      const { product_id, quantity, price, discount_id, discount_amount } =
        item;

      // Create order item
      await OrderItem.create(
        {
          discountId: discount_id || null,
          productId: product_id,
          orderHistoryId: order.id,
          paymentAmount: price * quantity - (discount_amount || 0),
          price: price,
          discountAmount: discount_amount || 0,
          quantity: quantity,
        },
        { transaction } // Ensure this operation is part of the transaction
      );

      // Update product stock quantity
      await Product.update(
        { stock_quantity: sequelize.literal(`stock_quantity - ${quantity}`) },
        {
          where: { id: product_id },
          transaction, // Ensure this operation is part of the transaction
        }
      );
    }

    // Commit the transaction
    await transaction.commit();
    if (payment_method === "VNPAY") {
      const paymentUrl = await paymentWithVnpay({
        total_amount,
        customer_id,
        ipAddr,
      });
      res.redirect(paymentUrl);
    }
    // Send response back to the client
    return res.status(200).json({ orderNo });
  } catch (err) {
    // Rollback the transaction in case of an error
    if (transaction) await transaction.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};
module.exports = { createOrder };
