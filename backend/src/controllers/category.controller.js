const categoryServices = require('../services/category.service')
const fetchItemByCategoryName = async (req, res) => {
  const categoryName = req.params.categoryName;
  try {
    const categoryItem = await categoryServices.fetchItemByCategoryName(
      categoryName
    );
    res.status(200).json(categoryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  fetchItemByCategoryName,
};
