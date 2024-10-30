const PaymentService = require('../services/payment.service');
const db = require("../db");

exports.initiatePayment = async (req, res) => {
    const { paymentMethod, orderId, amount } = req.body;

    try {
        // Xử lý nếu là thanh toán COD
        if (paymentMethod === 'cod') {
            // Cập nhật trạng thái đơn hàng thành 'cod' để đánh dấu là thanh toán khi nhận hàng
            await db.query(
                "UPDATE orders SET payment_status = 'cod' WHERE order_id = ?",
                [orderId]
            );

            return res.status(200).json({
                success: true,
                message: 'Đơn hàng COD được đặt thành công và sẽ thanh toán khi nhận hàng.',
                data: { orderId, payment_status: 'cod' }
            });
        }

        // Xử lý thanh toán trực tuyến qua cổng thanh toán
        const paymentResult = await PaymentService.processPayment(req.body);

        // Cập nhật trạng thái đơn hàng sau khi thanh toán thành công
        if (paymentResult.success) {
            await db.query(
                "UPDATE orders SET payment_status = 'paid' WHERE order_id = ?",
                [orderId]
            );
        }

        // Trả về kết quả thanh toán cho frontend
        res.status(paymentResult.success ? 200 : 400).json(paymentResult);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Không thể xử lý thanh toán.',
            error: error.message
        });
    }
};
