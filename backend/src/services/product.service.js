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
};

const createProduct = async (req) => {
  const {
    productName,
    description,
    price,
    stockQuantity,
    category,
    color,
    size,
    image,
    skuCode,
  } = req.body;

  try {
    const [existingProduct] = await db.query(
      "SELECT * FROM products WHERE skucode = ?",
      [skuCode]
    );

    if (existingProduct.length > 0) {
      throw new Error("Existed products with the same skucode!");
    } else {
      await db.query(
        "INSERT INTO products (product_name, description, price, stock_quantity, category, color, size, skucode, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          productName,
          description,
          price,
          stockQuantity,
          category,
          color,
          size,
          skuCode,
          image,
        ]
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const editProduct = async (req) => {
  const {
    productName,
    description,
    price,
    stockQuantity,
    category,
    color,
    size,
    image,
    skuCode,
  } = req;

  try {
    // Kiểm tra sản phẩm tồn tại
    const [existingProduct] = await db.query(
      "SELECT 1 FROM products WHERE skucode = ?",
      [skuCode]
    );

    if (existingProduct.length === 0) {
      throw new Error("Product with the corresponding SKU code does not exist");
    }

    // Cập nhật sản phẩm
    await db.query(
      "UPDATE products SET product_name = ?, description = ?, price = ?, stock_quantity = ?, category = ?, color = ?, size = ?, image = ? WHERE skucode = ?",
      [
        productName,
        description,
        price,
        stockQuantity,
        category,
        color,
        size,
        image,
        skuCode,
      ]
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (req) => {
  const { skuCode } = req.body; // Chỉ cần `skuCode` để xác định sản phẩm cần xóa

  try {
    // Kiểm tra sản phẩm tồn tại
    const [existingProduct] = await db.query(
      "SELECT 1 FROM products WHERE skucode = ?",
      [skuCode]
    );

    if (existingProduct.length === 0) {
      throw new Error("Product with the corresponding SKU code does not exist");
    }

    // Xóa sản phẩm
    await db.query(
      "DELETE FROM products WHERE skucode = ?",
      [skuCode]
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getProductInfoByProductName,
  createProduct,
  editProduct,
  deleteProduct,
};
