const axios = require("axios"); // để gọi đến cổng thanh toán

const processPayment = async (paymentData) => {
  const { paymentMethod, orderId, amount } = paymentData;

  // Tùy chọn cổng thanh toán dựa trên paymentMethod
  const gatewayUrl = getGatewayUrl(paymentMethod);

  // Gọi đến cổng thanh toán
  const response = await axios.post(gatewayUrl, { orderId, amount });

  if (response.data.status === "success") {
    // Xử lý thành công, cập nhật trạng thái đơn hàng
    return { status: "paid", orderId };
  } else {
    throw new Error("Thanh toán thất bại");
  }
};

function getGatewayUrl(paymentMethod) {
  // Cấu hình URL cổng thanh toán tùy theo phương thức
  const gateways = {
    credit_card: "https://api.creditcard.com/payment",
    paypal: "https://api.paypal.com/payment",
  };
  return gateways[paymentMethod];
}

const getDeliveryFee = async (longtitude, latitude) => {
  const shopAddress = "105.843227,21.006063"; // tọa độ của ĐHBK Hà Nội
  const endPoint = `${longtitude},${latitude}`;
  const API_KEY = "5b3ce3597851110001cf62483c6184ede81e47c2a27ab1bf34b63d29";
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?start=${shopAddress}&end=${endPoint}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: API_KEY,
    },
  });
  const distance = response.data.features[0].properties.segments[0].distance;
  let deliveryFee;
  switch (true) {
    case distance < 5000:
      deliveryFee = 0;
      break;
    case 5000 <= distance && distance < 20000:
      deliveryFee = (distance / 1000) * 5000;
      break;
    default:
      deliveryFee = (distance / 1000) * 3000;
      break;
  }
  return deliveryFee;
};
module.exports = { getDeliveryFee, processPayment };
