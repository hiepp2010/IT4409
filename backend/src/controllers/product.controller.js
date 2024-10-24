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
module.exports = {
  fetchProduct,
};
