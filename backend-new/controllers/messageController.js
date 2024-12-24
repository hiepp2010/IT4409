const { Message } = require("../models/model");
const { Op } = require("sequelize");

const fetchMessageHistory = async (req, res) => {
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
