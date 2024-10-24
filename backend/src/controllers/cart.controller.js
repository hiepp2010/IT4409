const cartService = require("../services/cart.service");
const addToCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId, quantity } = req.body;
    await cartService.addToCart(userId, productId, quantity);
    res.status(200).json("Add to cart successfully!");
  } catch {
    res.status(500).json("Failed to add to cart !");
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    await cartService.getCart(userId);
    res.status(200).json("Get cart infomation successfully !");
  } catch {
    res.status(500).json("Failed to get cart infomation");
  }
};
module.export = {
  addToCart,
  getCart,
};
