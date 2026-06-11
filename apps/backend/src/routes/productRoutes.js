const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protect, adminOnly, uploadMultiple, createProduct);
router.put('/:id', protect, adminOnly, uploadMultiple, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
