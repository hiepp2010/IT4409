const db = require("../db");
const authMiddleware = async (req, res) => {
  const userId = req.session.userId;
  const [user] = db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
  if (!user.length) res.status(403).json("You has not login yet");
  next();
};
module.exports = {
  authMiddleware,
};
