const { Product, OrderItem, OrderHistory, Color, Size } = require("../models/model");
const { Sequelize, DataTypes } = require('sequelize');
const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");

const sequelize = new Sequelize('backend', 'root', '1234abcd', {
  host: 'localhost',
  port: 3307,
  dialect: 'mysql'
});

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
    const vnpUrl = "https://sandbox.vnpayment.vn/pa ymentv2/vpcpay.html";
    const returnUrl = "localhost:3000";

    // Generate timestamps
    const date = moment();
    const createDate = date.format("YYYYMMDDHHmmss");
    const orderId = date.format("HHmmss");
    const expireDate = moment().add(6, "hours").format("YYYYMMDDHHmmss");
    const amount = total_amount; // Assuming total_amount is in VND
    const orderInfo = "Thanhtoanchokhachhang${customer_id}giatri${total_amount}";
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
      vnp_ExpireDate: expireDate,
   //   vnp_BankCode: "NCB",
    };
    vnp_Params = _sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // Sort parameters and create query string

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
  const{
    userId,
    orderData
  } = req.body;

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    "127.0.0.1";
    if (ipAddr === "::1" || ipAddr === "::1%0") {
      ipAddr = "127.0.0.1";
    }
  // Validation check
  // if (
  //   !customer_id ||
  //   !phone_number ||
  //   !address ||
  //   !items ||
  //   items.length === 0
  // ) {
  //   return res
  //     .status(400)
  //     .json({ message: "Thông tin đơn hàng không hợp lệ." });
  // }

  const orderNo = 'ORD${Date.now()}'; // Generate order number
  let total_amount = 0;
  let total_discount = 0;

  // Calculate total amount and total discount
  orderData.items.forEach((item) => {
    const { price, quantity, discount_amount } = item;
    total_amount += price * quantity;
    total_discount += discount_amount ? discount_amount * quantity : 0;
  });

  // Start a transaction
  // const transaction = await sequelize.transaction();

  try {
    // Create order in OrderHistory
    const order = await OrderHistory.create(
      {
        status: "Processing",
        totalAmount: total_amount,
        paymentMethod: orderData.paymentMethod,
        phoneNumber: orderData.shippingInfo.phone,
        address: orderData.shippingInfo.address,
        userId: userId,
      },
    );

    // // Process each item in the order
    for (const item of orderData.items) {  
      await OrderItem.create({ orderHistoryId: order.id, productId: item.productId, quantity: item.quantity, price: item.price, size:item.size});
      
      const color = await Color.findOne({ where: { productId: item.productId, name: item.colorId }});
      const sizeModel = await Size.findOne({ where: { colorId: color.id, name: item.size } }); 
      if (sizeModel) { sizeModel.quantity -= item.quantity; await sizeModel.save();}
     
    }

    // Commit the transaction
    // await transaction.commit();
    if (orderData.paymentMethod === "vnpay") {
      const paymentUrl = await paymentWithVnpay({
        total_amount,
        user_id,
        ipAddr,
      });
      console.log(paymentUrl);
      res.status(200).json({ paymentUrl: paymentUrl });
      // res.redirect(paymentUrl);
    }
    else{
      res.status(200).json({"status":"ok"})
    }
    // Send response back to the client
    //  res.status(200).json({ orderNo });
  } catch (err) {
    // Rollback the transaction in case of an error
    // if (transaction) await transaction.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

const getOrdersByUserId = async (req,res)=>{
  const{userId} = req.params;

  console.log(userId)
  
  try{
    const orders = await OrderHistory.findAll ({
      where: { userId},
      include:[
        {model: OrderItem, as: 'orderItems' }
      ]
    });
    const allOrder = await OrderHistory.findAll ({
      include:[
        {model: OrderItem, as: 'orderItems' }
      ]
    });

    console.log(allOrder)

    if(orders.length == 0 ){
      return res.status(404).json({ error: 'No orders found for this user' });
    }
    
    res.status(200).json(orders)
  } catch (error){
    res.status(500).json({ error: error.message});
  }
};

const getAllOrders = async(req,res) => {
  const { page = 1, limit = 10 } = req.query;
  try{
    const orders = await OrderHistory.findAndCountAll({
      include: [
        {model: OrderItem, as: 'orderItems'}
      ],
    });
    console.log(orders)
    res.status(200).json({orders:orders.rows, total:orders.count})
  } catch (error){
    console.log(error)
    res.status(500).json({error:error.message})
  }
}

const getOrderById = async(req,res) => {
  const {id} = req.params;

  try{
    const order = await OrderHistory.findByPk(id,{
      include: [
        {model: OrderItem, as: 'orderItems'}
      ]
    })
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}



module.exports = { createOrder, getOrdersByUserId, getAllOrders, getOrderById };