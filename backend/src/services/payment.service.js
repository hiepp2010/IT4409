const axios = require('axios'); // để gọi đến cổng thanh toán

exports.processPayment = async (paymentData) => {
    const { paymentMethod, orderId, amount } = paymentData;
    
    // Tùy chọn cổng thanh toán dựa trên paymentMethod
    const gatewayUrl = getGatewayUrl(paymentMethod);

    // Gọi đến cổng thanh toán
    const response = await axios.post(gatewayUrl, { orderId, amount });

    if (response.data.status === 'success') {
        // Xử lý thành công, cập nhật trạng thái đơn hàng
        return { status: 'paid', orderId };
    } else {
        throw new Error('Thanh toán thất bại');
    }
};

function getGatewayUrl(paymentMethod) {
    // Cấu hình URL cổng thanh toán tùy theo phương thức
    const gateways = {
        'credit_card': 'https://api.creditcard.com/payment',
        'paypal': 'https://api.paypal.com/payment'
    };
    return gateways[paymentMethod];
}
