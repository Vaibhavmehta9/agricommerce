const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');

/**
 * @desc   Upload a single image
 * @route  POST /api/upload
 * @access Private/Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  (req, res, next) => {
    uploadSingle(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  }
);

/**
 * @desc   Upload multiple images (up to 10)
 * @route  POST /api/upload/multiple
 * @access Private/Admin
 */
router.post(
  '/multiple',
  protect,
  adminOnly,
  (req, res, next) => {
    uploadMultiple(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const urls = req.files.map((file) => `/uploads/${file.filename}`);
    res.status(200).json({
      success: true,
      message: `${urls.length} image(s) uploaded successfully`,
      urls,
    });
  }
);

module.exports = router;
