const Category = require('../models/Category');

/**
 * @desc   Get all active categories sorted by displayOrder
 * @route  GET /api/categories
 * @access Public
 */
const getCategories = async (req, res) => {
  const { status, all } = req.query;

  const filter = {};

  // By default return only active categories (unless admin requests all)
  if (all === 'true') {
    if (status) filter.status = status;
  } else {
    filter.status = 'active';
  }

  const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({ success: true, total: categories.length, categories });
};

/**
 * @desc   Get single category by ID
 * @route  GET /api/categories/:id
 * @access Public
 */
const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json({ success: true, category });
};

/**
 * @desc   Create a category (admin)
 * @route  POST /api/categories
 * @access Private/Admin
 */
const createCategory = async (req, res) => {
  const data = { ...req.body };

  // Handle image upload
  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  const category = await Category.create(data);

  res.status(201).json({ success: true, message: 'Category created successfully', category });
};

/**
 * @desc   Update a category (admin)
 * @route  PUT /api/categories/:id
 * @access Private/Admin
 */
const updateCategory = async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  const category = await Category.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json({ success: true, message: 'Category updated successfully', category });
};

/**
 * @desc   Delete a category (admin)
 * @route  DELETE /api/categories/:id
 * @access Private/Admin
 */
const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json({ success: true, message: 'Category deleted successfully' });
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
