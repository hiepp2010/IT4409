const { redisClient } = require("../../redisConfig");
const db = require("../db");
const addToCart = async ({ userId, productId, quantity }) => {
  const cartKey = `cart:${userId}:${productId}`;
  try {
    await redisClient.incrBy(cartKey, quantity);
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
      const [existing] = await db.query(
        "SELECT quantity FROM shopping_cart WHERE customer_id = ? AND product_id = ?",
        [userId, productId]
      );

      if (existing) {
        // Update the quantity if the record exists
        await db.query(
          "UPDATE shopping_cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ?",
          [quantity, userId, productId]
        );
      } else {
        // Insert a new record if it does not exist
        await db.query(
          "INSERT INTO shopping_cart (customer_id, product_id, quantity) VALUES (?, ?, ?)",
          [userId, productId, quantity]
        );
      }
      await redisClient.del(key);
    }
    const result = await db.query(
      "SELECT * FROM shopping_cart WHERE customer_id = ?",
      [userId]
    );
    return result;
  } catch (error) {
     // eslint-disable-next-line no-console
    console.error("Error updating cart:", error);
    throw new Error("Failed to update cart!");
  }
};
module.exports = {
  addToCart,
  getCart,
};
