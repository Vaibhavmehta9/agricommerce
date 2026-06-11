const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, adminOnly, uploadSingle, createCategory);
router.put('/:id', protect, adminOnly, uploadSingle, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
