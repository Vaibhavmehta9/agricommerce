const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc   Place a new order (B2C)
 * @route  POST /api/orders
 * @access Public
 */
const createOrder = async (req, res) => {
  const { customer, items, notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must include at least one item' });
  }

  // Server-side total calculation: fetch live prices from DB
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  const productMap = {};
  products.forEach((p) => {
    productMap[p._id.toString()] = p;
  });

  let total = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = productMap[item.product];
    if (!product) {
      return res.status(400).json({
        success: false,
        message: `Product with ID ${item.product} not found`,
      });
    }
    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Product "${product.name}" is not available`,
      });
    }
    const quantity = parseInt(item.quantity, 10);
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
      });
    }

    validatedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });

    total += product.price * quantity;
  }

  // Decrement stock for all items
  const bulkOps = validatedItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: -item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOps);

  const order = await Order.create({
    customer,
    items: validatedItems,
    total: parseFloat(total.toFixed(2)),
    notes: notes || '',
  });

  res.status(201).json({ success: true, message: 'Order placed successfully', order });
};

/**
 * @desc   Get all orders (admin)
 * @route  GET /api/orders
 * @access Private/Admin
 */
const getOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (status) filter.status = status;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('items.product', 'name slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    orders,
  });
};

/**
 * @desc   Update order status (admin)
 * @route  PUT /api/orders/:id/status
 * @access Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const oldStatus = order.status;
  order.status = status;
  await order.save();

  // Restore stock if changing to Cancelled
  if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
    const bulkOps = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOps);
  }

  // Restore stock if changing FROM Cancelled to active state (optional, let's keep it simple: just decrement stock again if it goes from Cancelled to active status)
  if (oldStatus === 'Cancelled' && status !== 'Cancelled') {
    const bulkOps = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOps);
  }

  const populatedOrder = await Order.findById(order._id).populate('items.product', 'name slug');

  res.status(200).json({ success: true, message: 'Order status updated', order: populatedOrder });
};

module.exports = { createOrder, getOrders, updateOrderStatus };
