const Product = require('../models/Product');

/**
 * @desc   Get all products with filters and pagination
 * @route  GET /api/products
 * @access Public
 */
const getProducts = async (req, res) => {
  const { category, search, status, b2b, b2c, page = 1, limit = 12 } = req.query;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) {
    filter.status = status;
  } else {
    filter.status = 'active';
  }

  if (b2b === 'true') {
    filter.b2bVisible = true;
  }

  if (b2c === 'true') {
    filter.b2cVisible = true;
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    products,
  });
};

/**
 * @desc   Get single product by slug + related products
 * @route  GET /api/products/:slug
 * @access Public
 */
const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    status: 'active',
  })
    .populate('category', 'name slug')
    .limit(4);

  res.status(200).json({ success: true, product, related });
};

/**
 * @desc   Create a product (admin)
 * @route  POST /api/products
 * @access Private/Admin
 */
const createProduct = async (req, res) => {
  const data = { ...req.body };

  // Handle image uploads from req.files
  if (req.files && req.files.length > 0) {
    data.images = req.files.map((file) => `/uploads/${file.filename}`);
  }

  // Handle specs if sent as JSON string
  if (data.specs && typeof data.specs === 'string') {
    try {
      data.specs = JSON.parse(data.specs);
    } catch {
      data.specs = [];
    }
  }

  const product = await Product.create(data);
  const populated = await product.populate('category', 'name slug');

  res.status(201).json({ success: true, message: 'Product created successfully', product: populated });
};

/**
 * @desc   Update a product (admin)
 * @route  PUT /api/products/:id
 * @access Private/Admin
 */
const updateProduct = async (req, res) => {
  const data = { ...req.body };

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    data.images = req.files.map((file) => `/uploads/${file.filename}`);
  }

  if (data.specs && typeof data.specs === 'string') {
    try {
      data.specs = JSON.parse(data.specs);
    } catch {
      data.specs = [];
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({ success: true, message: 'Product updated successfully', product });
};

/**
 * @desc   Delete a product (admin)
 * @route  DELETE /api/products/:id
 * @access Private/Admin
 */
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
};

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };
