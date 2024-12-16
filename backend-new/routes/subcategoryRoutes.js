const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.getAllSubCategories);
router.get('/:id', categoryController.getSubCategoryById);
router.post('/', categoryController.createSubCategory);
router.put('/:id', categoryController.updateSubCategory);
router.delete('/:id', categoryController.deleteSubCategory);

module.exports = router;
