const express = require('express');
const router = express.Router();
const { getHomepage, updateHomepage } = require('../controllers/homepageController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getHomepage);
router.put('/', protect, adminOnly, updateHomepage);

module.exports = router;
