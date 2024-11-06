const db = require("../db");

const getProductInfoByProductName = async (productName) => {
    try {
        const [rows] = await db.query(
          "SELECT * FROM products WHERE product_name = ?",
          [productName]
        );
        return rows;
      } catch (error) {
        throw error;
      }
}
module.exports = {
    getProductInfoByProductName,
}