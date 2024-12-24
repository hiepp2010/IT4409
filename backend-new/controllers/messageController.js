const { Message } = require("../models/model");
const { Op } = require("sequelize");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const fetchMessageHistory = async (req, res) => {
  try {
    const { senderId,receiverId } = req.query;
    console.log("abc")

    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: senderId }, { receiverId: senderId }],
      },
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchCustomer = async (req, res) => {
  try {
    const adminId = '1' // The admin ID

    // Find all unique customer IDs from messages
    const customers = await Message.findAll({
      attributes: [
        'senderId',
        'receiverId'
      ],
      where: {
        [Op.or]: [
          { senderId: { [Op.ne]: adminId } },
          { receiverId: { [Op.ne]: adminId } }
        ]
      },
      raw: true
    })

    // Extract unique customer IDs (excluding admin)
    const uniqueCustomers = new Set()
    customers.forEach(message => {
      if (message.senderId !== adminId) {
        uniqueCustomers.add(message.senderId)
      }
      if (message.receiverId !== adminId) {
        uniqueCustomers.add(message.receiverId)
      }
    })

    // Format the response
    const customerList = Array.from(uniqueCustomers).map(id => ({
      id: id,
      name: `Customer ${id}`,
      status: 'offline' // Default status
    }))

    // Update online status for connected customers
    const connectedCustomers = Object.values(global.customers || {})
      .map((customer) => customer.userId)
    
    customerList.forEach(customer => {
      if (connectedCustomers.includes(customer.id)) {
        customer.status = 'online'
      }
    })


    res.json(customerList)
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
}

module.exports = { fetchMessageHistory, fetchCustomer };
