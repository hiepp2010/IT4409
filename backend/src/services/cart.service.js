const { redisClient } = require("../../redisConfig");
const db = require("../db");
const addToCart = async (userId, productId, quantity) => {
  const cartKey = `cart:${userId}:${productId}`;
  try {
    await redisClient.setEx(cartKey, 86400, quantity.toString());
  } catch {
    throw new Error("Can not save to redis");
  }
};

const getCart = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const keys = await redisClient.keys(`cart:${userId}:*`);

    if (keys.length === 0) {
      return;
    }

    for (const key of keys) {
      const productId = key.split(":")[2];
      const quantity = await redisClient.get(key);

      if (!quantity || isNaN(quantity)) {
        continue;
      }

      await db.query(
        "INSERT INTO shopping_cart (customer_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
        [userId, productId, quantity, quantity]
      );

      await redisClient.del(key);
    }
  } catch (error) {
    // Log lỗi để debug
    console.error("Error updating cart:", error);
    throw new Error("Failed to update cart!");
  }
};
module.exports = {
  addToCart,
  getCart,
};
