const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getMyOrders,
  trackOrder,
  cancelOrder,
  returnOrder,
} = require('../controllers/orderController');
const { protect, adminOnly, optionalProtect } = require('../middleware/auth');

router.post('/', optionalProtect, createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/track', trackOrder);
router.put('/:id/cancel', optionalProtect, cancelOrder);
router.put('/:id/return', optionalProtect, returnOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
