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

const createProduct = async ({ req, imagePath }) => {
  const {
    productName,
    description,
    price,
    stockQuantity,
    category,
    color,
    size,
    skuCode,
  } = req;
  imagePath = imagePath.replace(/\\/g, "/");
  try {
    const [existingProduct] = await db.query(
      "SELECT * FROM products WHERE skucode = ?",
      [skuCode]
    );

    if (!!existingProduct) {
      throw new Error("Existed products with the same skucode!");
    } else {
      await db.query(
        "INSERT INTO products (product_name, description, price, stock_quantity, category, color, size, skucode, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          productName,
          description,
          price,
          stockQuantity,
          category,
          color,
          size,
          skuCode,
          imagePath,
        ]
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const editProduct = async ({ req, imagePath }) => {
  const {
    productName,
    description,
    price,
    stockQuantity,
    category,
    color,
    size,
    skuCode,
  } = req;

  try {
    imagePath = imagePath.replace(/\\/g, "/");
    // Kiểm tra sản phẩm tồn tại
    const [existingProduct] = await db.query(
      "SELECT 1 FROM products WHERE skucode = ?",
      [skuCode]
    );

    if (!existingProduct) {
      throw new Error("Product with the corresponding SKU code does not exist");
    }

    // Cập nhật sản phẩm
    await db.query(
      "UPDATE products SET product_name = ?, description = ?, price = ?, stock_quantity = ?, category = ?, color = ?, size = ?, image_path = ? WHERE skucode = ?",
      [
        productName,
        description,
        price,
        stockQuantity,
        category,
        color,
        size,
        imagePath,
        skuCode,
      ]
    );
  } catch (error) {
    throw new Error(`Failed to edit product: ${error.message}`);
  }
};

const deleteProduct = async (req) => {
  const { skuCode } = req; // Chỉ cần `skuCode` để xác định sản phẩm cần xóa

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
    await db.query("DELETE FROM products WHERE skucode = ?", [skuCode]);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Tìm sản phẩm theo tên
const findProductByName = async (productName) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE product_name = ?",
      [productName]
    );
    return rows[0]; // Trả về sản phẩm đầu tiên
  } catch (error) {
    throw error;
  }
};

const getProductReview = async (productId) => {
  try {
    let averageRating = 0; // Khởi tạo giá trị trung bình
    const [productReviews] = await db.query(
      "SELECT * FROM product_reviews WHERE product_id = ?",
      [productId]
    );

    if (!productReviews || productReviews.length === 0) {
      return { productReviews: [], averageRating }; // Nếu không có đánh giá, trả về mảng rỗng và rating bằng 0
    }

    let totalProductReviewsSum = 0;
    for (const productReview of productReviews) {
      totalProductReviewsSum += productReview.rating;
    }

    // Tính toán rating trung bình
    averageRating = (totalProductReviewsSum / productReviews.length).toFixed(1);
    return { productReviews, averageRating }; // Trả về cả reviews và averageRating
  } catch (error) {
    throw error;
  }
};

const uploadProductReview = async (
  productId,
  rating,
  reviewText,
  reviewDate,
  customerId
) => {
  try {
    await db.query(
      "INSERT INTO product_reviews (product_id, customer_id, rating, review_text, review_date) VALUES (?, ?, ?, ?, ?)",
      [productId, customerId, rating, reviewText, reviewDate]
    );
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getProductInfoByProductName,
  createProduct,
  editProduct,
  deleteProduct,
  findProductByName,
  getProductReview,
  uploadProductReview,
};
