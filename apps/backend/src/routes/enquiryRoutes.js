const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', createEnquiry);
router.get('/', protect, adminOnly, getEnquiries);
router.put('/:id/status', protect, adminOnly, updateEnquiryStatus);

module.exports = router;
