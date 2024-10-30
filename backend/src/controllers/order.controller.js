const OrderService = require('../services/order.service');
const PaymentController = require('./payment.controller'); // Import để gọi thanh toán nếu cần


exports.createOrder = async (req, res) => {
    try {
        const { customerId, items, totalAmount, paymentMethod } = req.body;

        // Tạo đơn hàng với trạng thái 'pending'
        const newOrder = await OrderService.createOrder({
            customerId,
            items,
            totalAmount,
            paymentMethod
        });

        // Nếu là COD, trả về thông báo thành công, không cần gọi thanh toán
        if (paymentMethod === 'cod') {
            return res.status(200).json({
                success: true,
                message: 'Đơn hàng COD được đặt thành công.',
                data: newOrder
            });
        }

        // Nếu không phải COD, gọi hàm thanh toán
        const paymentResult = await PaymentController.initiatePayment({
            body: { paymentMethod, orderId: newOrder.id, amount: totalAmount }
        });

        res.status(paymentResult.success ? 200 : 400).json(paymentResult);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể đặt hàng.', error: error.message });
    }
};
