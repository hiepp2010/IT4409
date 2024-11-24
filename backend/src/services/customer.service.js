const db = require("../db");

// Service để lấy danh sách khách hàng
const getCustomers = async (phone_number) => {
    let query = 'SELECT user_id, username, phone_number, email, address, role FROM Users WHERE role = "customer"';
    const queryParams = [];
    
    if (phone_number) {
        query += ' AND phone_number LIKE ?';
        queryParams.push(`%${phone_number}%`);
    }

    try {
        const [results] = await db.execute(query, queryParams);
        return results;
    } catch (err) {
        console.error('Database error:', err);
        throw err;
    }
};

const getCustomerDetails = async (userId) => {
    try {
        // Lấy thông tin cơ bản của khách hàng
        const [user] = await db.execute(
            `SELECT user_id, username, phone_number, email, address, role 
             FROM Users WHERE user_id = ?`,
            [userId]
        );

        if (user.length === 0) {
            throw new Error('Không tìm thấy khách hàng');
        }

        // Lấy thông tin đơn hàng của khách hàng
        const [orders] = await db.execute(
            `SELECT order_id, orderNo, status, total_amount, total_discount, payment_method, created_at
             FROM Orders WHERE customer_id = ?`,
            [userId]
        );

        // Lấy chi tiết từng đơn hàng của khách hàng
        const orderDetailsPromises = orders.map(async (order) => {
            const [details] = await db.execute(
                `SELECT oi.product_id, p.product_name, p.category, p.price, oi.quantity, oi.discount_amount
                 FROM Order_Items oi
                 JOIN Products p ON oi.product_id = p.product_id
                 WHERE oi.order_id = ?`,
                [order.order_id]
            );
            return {
                order_id: order.order_id,
                orderNo: order.orderNo,
                status: order.status,
                total_amount: order.total_amount,
                total_discount: order.total_discount,
                payment_method: order.payment_method,
                created_at: order.created_at,
                items: details
            };
        });

        const orderDetails = await Promise.all(orderDetailsPromises);

        return {
            user: user[0],
            orders: orderDetails
        };
    } catch (err) {
        console.error('Database error:', err);
        throw err;
    }
};

module.exports = {
    getCustomers,
    getCustomerDetails,
}