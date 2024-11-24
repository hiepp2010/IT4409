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

module.exports = {
    getCustomers,
}