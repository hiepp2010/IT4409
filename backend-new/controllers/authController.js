const { User } = require('../models/model');

const authController = {
  signup: async (req, res) => {
    const { username, password } = req.body;
    const role = "user";

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const user = await User.create({
        username,
        password, // No hashing
        role
      });

      res.status(201).json({ userId: user.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = await User.findOne({ where: { username, password } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      res.status(200).json({ userId: user.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;
