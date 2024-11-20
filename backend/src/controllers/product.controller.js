const productService = require("../services/product.service");
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
multer({ storage: multer.memoryStorage() });
const fetchProduct = async (req, res) => {
  const { productName } = req.body;
  try {
    const productInfo = await productService.getProductInfoByProductName(
      productName
    );
    res.status(200).json(productInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const imagePath = path.join(
      "images",
      `${path.parse(req.file.originalname).name}.png` // Sửa lại thành template string đúng cú pháp
    );

    await sharp(req.file.buffer).toFormat("png").toFile(imagePath);

    //  const imagePath = path.join(req.file.destination, req.file.filename);
    await productService.createProduct({ req: req.body, imagePath: imagePath });

    res.status(200).json("Create product successfully!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const imagePath = path.join(
      "images",
      `${path.parse(req.file.originalname).name}.png` // Sửa lại thành template string đúng cú pháp
    );
    await sharp(req.file.buffer).toFormat("png").toFile(imagePath);
    await productService.editProduct({ req: req.body, imagePath: imagePath });
    res.status(200).json("Update product successfully!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.body);
    res.status(200).json("Delete product successfully!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductByName = async (req, res) => {
  try {
      const { productName } = req.params;
      const product = await productService.findProductByName(productName);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  fetchProduct,
  createProduct,
  editProduct,
  deleteProduct,
  getProductByName,
};
