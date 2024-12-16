const { Category, SubCategory } = require('../models/model');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [
          { model: SubCategory, as: 'subCategories' }
        ]
      });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByPk(id, {
        include: [
          { model: SubCategory, as: 'subCategories' }
        ]
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCategory: async (req, res) => {
    const { name, subCategories } = req.body;
    try {
      const category = await Category.create({ name });

      if (subCategories && subCategories.length > 0) {
        for (const subCategoryName of subCategories) {
          await SubCategory.create({ name: subCategoryName, categoryId: category.id });
        }
      }

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await category.update({ name });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await category.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Subcategory related methods
  getAllSubCategories: async (req, res) => {
    try {
      const subCategories = await SubCategory.findAll();
      res.status(200).json(subCategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSubCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const subCategory = await SubCategory.findByPk(id, {
        include: [{ model: Category, as: 'category' }]
      });

      if (!subCategory) {
        return res.status(404).json({ error: 'SubCategory not found' });
      }

      res.status(200).json(subCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSubCategory: async (req, res) => {
    const { name, categoryId } = req.body;
    try {
      const subCategory = await SubCategory.create({ name, categoryId });
      res.status(201).json(subCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateSubCategory: async (req, res) => {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    try {
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        return res.status(404).json({ error: 'SubCategory not found' });
      }

      await subCategory.update({ name, categoryId });
      res.status(200).json(subCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteSubCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        return res.status(404).json({ error: 'SubCategory not found' });
      }

      await subCategory.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = categoryController;
