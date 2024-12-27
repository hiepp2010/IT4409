const { Product, Color, Size, ImagePath, SubCategory } = require('../models/model');
const { Op } = require('sequelize');

const productController = {
  getProducts: async (req, res) => {
    const { page = 1, limit = 9, subcategoryId, categoryId,sku } = req.query;

    try {
      let where = {};
      if (subcategoryId) where.subcategoryId = subcategoryId;
      if (sku) where.sku = { [Op.like]: `%${sku}%` };

      const products = await Product.findAndCountAll({
        where,
        include: [
          { model: Color, as: 'colors', include: [{ model: Size, as: 'sizes' }, { model: ImagePath, as: 'imagePaths' }] },
          { model: SubCategory, as: 'subCategory' }
        ],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * limit
      });

      res.status(200).json({ products: products.rows, total: products.count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id, {
        include: [
          { model: Color, as: 'colors', include: [{ model: Size, as: 'sizes' }, { model: ImagePath, as: 'imagePaths' }] },
          { model: SubCategory, as: 'subCategory' }
        ]
      });

      if (!product) return res.status(404).json({ error: 'Product not found' });

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductBySku: async (req, res) => {
    const { sku } = req.params;

    try {
        const product = await Product.findOne({
            where: { sku },
            include: [
                { 
                    model: Color, 
                    as: 'colors', 
                    include: [
                        { model: Size, as: 'sizes' }, 
                        { model: ImagePath, as: 'imagePaths' }
                    ] 
                },
                { model: SubCategory, as: 'subCategory' }
            ]
        });

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  },


  createProduct: async (req, res) => {
    const { name, description, subcategoryId, brand, sku, price, discountedPrice, tags, colors } = req.body;
    try {
      const product = await Product.create({
        name,
        description,
        subcategoryId,
        brand,
        sku,
        price,
        discountedPrice,
        tags
      });

      if (colors) {
        for (const colorData of colors) {
          const color = await Color.create({ name: colorData.name, productId: product.id });
          if (colorData.sizes) {
            for (const sizeData of colorData.sizes) {
              await Size.create({ name: sizeData.name, quantity: sizeData.quantity, colorId: color.id });
            }
          }

          if (colorData.imagePaths) {
            for (const imagePath of colorData.imagePaths) {
              await ImagePath.create({ path: imagePath, colorId: color.id });
            }
          }
        }
      }

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, description, subcategoryId, brand, sku, price, discountedPrice, tags, colors } = req.body;

    try {
      const product = await Product.findByPk(id, {
        include: [
          { model: Color, as: 'colors', include: [{ model: Size, as: 'sizes' }, { model: ImagePath, as: 'imagePaths' }] },
        ]
      });

      if (!product) return res.status(404).json({ error: 'Product not found' });

      await product.update({ name, description, subcategoryId, brand, sku, price, discountedPrice, tags });

      // Clear existing colors, sizes, and image paths
      await Color.destroy({ where: { productId: product.id } });

      if (colors) {
        for (const colorData of colors) {
          const color = await Color.create({ name: colorData.name, productId: product.id });
          if (colorData.sizes) {
            for (const sizeData of colorData.sizes) {
              await Size.create({ name: sizeData.name, quantity: sizeData.quantity, colorId: color.id });
            }
          }

          if (colorData.imagePaths) {
            for (const imagePath of colorData.imagePaths) {
              await ImagePath.create({ path: imagePath, colorId: color.id });
            }
          }
        }
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;

    try {
      const product = await Product.findByPk(id);

      if (!product) return res.status(404).json({ error: 'Product not found' });

      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;
