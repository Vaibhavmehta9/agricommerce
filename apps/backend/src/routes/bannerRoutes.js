const express = require('express');
const router = express.Router();
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.get('/', getBanners);
router.get('/:id', getBannerById);
router.post('/', protect, adminOnly, uploadSingle, createBanner);
router.put('/:id', protect, adminOnly, uploadSingle, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
