const { Message } = require("../models/model");
const { Op } = require("sequelize");

const fetchMessageHistory = async (req, res) => {
  try {
    const { senderId,receiverId } = req.paramms;
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
    const adminId = '1' // The admin ID as defined in frontend

    // Find all unique customer IDs from messages table
    // where they are either sender or receiver in conversations with admin
    const customerMessages = await Message.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('senderId')), 'customerId'],
        [Sequelize.literal(`(
          SELECT message 
          FROM messages AS m2 
          WHERE (
            (m2.senderId = Message.senderId AND m2.receiverId = '${adminId}') OR 
            (m2.senderId = '${adminId}' AND m2.receiverId = Message.senderId)
          )
          ORDER BY m2.createdAt DESC 
          LIMIT 1
        )`), 'lastMessage'],
        [Sequelize.literal(`(
          SELECT createdAt 
          FROM messages AS m2 
          WHERE (
            (m2.senderId = Message.senderId AND m2.receiverId = '${adminId}') OR 
            (m2.senderId = '${adminId}' AND m2.receiverId = Message.senderId)
          )
          ORDER BY m2.createdAt DESC 
          LIMIT 1
        )`), 'lastMessageTime']
      ],
      where: {
        [Op.or]: [
          { senderId: { [Op.ne]: adminId }, receiverId: adminId },
          { senderId: adminId, receiverId: { [Op.ne]: adminId } }
        ]
      },
      group: ['senderId'],
      order: [[Sequelize.literal('lastMessageTime'), 'DESC']]
    })

    // Get unique customer IDs
    const customerIds = customerMessages.map(msg => msg.getDataValue('customerId'))
      .filter(id => id !== adminId)

    // Format the response
    const customers = customerMessages.map(msg => ({
      id: msg.getDataValue('customerId'),
      // For demo, we'll use "Customer #[id]" as name if no user record exists
      name: `Customer #${msg.getDataValue('customerId')}`,
      lastMessage: msg.getDataValue('lastMessage'),
      lastSeen: msg.getDataValue('lastMessageTime'),
      status: 'offline' // Default to offline
    }))

    // Update status for any customers who are currently connected
    // This would be managed by your socket.io connection tracking
    const connectedCustomers = Object.values(global.customers || {})
      .map((customer) => customer.userId)
    
    customers.forEach(customer => {
      if (connectedCustomers.includes(customer.id)) {
        customer.status = 'online'
      }
    })

    res.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
}

const abc = async (req, res) => {
  try {
    const { customerId } = req.body;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: customerId }, { receiverId: customerId }],
      },
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchMessageHistory };
