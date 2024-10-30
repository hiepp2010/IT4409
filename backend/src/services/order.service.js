const db = require("../db");

exports.createOrder = async ({ customerId, items, totalAmount, paymentMethod }) => {
    // Tạo đơn hàng mới trong bảng orders
    const [orderResult] = await db.query(
        "INSERT INTO orders (customer_id, total_amount, payment_method, payment_status) VALUES (?, ?, ?, ?)",
        [customerId, totalAmount, paymentMethod, 'pending']
    );

    const orderId = orderResult.insertId;

    // Lưu từng mục trong đơn hàng vào bảng order_items
    for (const item of items) {
        await db.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
            [orderId, item.productId, item.quantity, item.price]
        );
    }

    // Trả về chi tiết đơn hàng
    return { id: orderId, customerId, totalAmount, paymentMethod, items };
};
