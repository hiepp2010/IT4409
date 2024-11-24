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


module.exports = {
    getAllCustomers
}
