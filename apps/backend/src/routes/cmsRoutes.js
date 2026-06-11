const express = require('express');
const router = express.Router();
const { getCMSPage, upsertCMSPage } = require('../controllers/cmsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/:slug', getCMSPage);
router.put('/:slug', protect, adminOnly, upsertCMSPage);

module.exports = router;
