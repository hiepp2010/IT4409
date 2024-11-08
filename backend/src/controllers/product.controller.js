const productService = require("../services/product.service");

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
    await productService.createProduct(req.body);
    res.status(200).json("Create product successfully!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    await productService.editProduct(req.body);
    res.status(200).json("Update product successfully!");
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.body);
    res.status(200).json("Delete product successfully!");
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  fetchProduct,
  createProduct,
  editProduct,
  deleteProduct,
};
