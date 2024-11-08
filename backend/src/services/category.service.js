const db = require("../db");
const fetchItemByCategoryName = async (categoryName) => {
    const parentCategories = ["TOP", "BOTTOM", "ACCESSORIES", "SNEAKER", "NEWS"];

  if (
    !parentCategories.includes(categoryName)
  ) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE category = ? LIMIT 50",
        [categoryName]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  if (categoryName === 'TOP') {
    try {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE category IN (?, ?, ?, ?, ?, ?) LIMIT 50",
        ['TSHIRTS', 'SWEATERS', 'JACKETS', 'SHIRT', 'HOODIES', 'LONGSLEEVES']
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  if (categoryName === 'BOTTOM') {
    try {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE category IN (?, ?, ?) LIMIT 50",
        ['SHORTS', 'DENIM', 'PANTS']
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  if (categoryName === 'ACCESSORIES') {
    try {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE category IN (?, ?, ?, ?) LIMIT 50",
        ['SLINGBAG', 'BACKPACK', 'CAP','SOCK']
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  if (categoryName === 'SNEAKERS') {
    try {
      const [rows] = await db.query(
        "SELECT * FROM products WHERE category IN (?, ?) LIMIT 50",
        ['SNEAKER', 'SLIDES', 'CAP']
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  if (categoryName === 'NEWS') {
    try {
        const [rows] = await db.query(
          "SELECT * FROM products ORDER BY product_id DESC LIMIT 50"
        );
        return rows;
      } catch (error) {
        throw error;
      }
  }
};

module.exports = {
  fetchItemByCategoryName,
};
