const customerService = require('../services/customer.service');

const getAllCustomers = async (req, res) => {
    try {
        const { phone_number } = req.query;
        const customers = await customerService.getCustomers(phone_number);
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error in controller:', error); 
        res.status(500).json({ message: 'Đã có lỗi xảy ra', error: error.message });
    }
};

const getCustomerDetails = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ request params
        const customerDetails = await customerService.getCustomerDetails(userId);
        res.status(200).json(customerDetails);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra', error: error.message });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerDetails,
}
