const Banner = require('../models/Banner');

/**
 * @desc   Get banners
 * @route  GET /api/banners
 * @access Public (active only); Admin sees all with ?all=true
 */
const getBanners = async (req, res) => {
  const { all, status } = req.query;
  const filter = {};

  if (all === 'true') {
    if (status) filter.status = status;
  } else {
    filter.status = 'active';
  }

  const banners = await Banner.find(filter).sort({ position: 1, createdAt: -1 });

  res.status(200).json({ success: true, total: banners.length, banners });
};

/**
 * @desc   Get single banner by ID
 * @route  GET /api/banners/:id
 * @access Public
 */
const getBannerById = async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }

  res.status(200).json({ success: true, banner });
};

/**
 * @desc   Create a banner (admin)
 * @route  POST /api/banners
 * @access Private/Admin
 */
const createBanner = async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  const banner = await Banner.create(data);

  res.status(201).json({ success: true, message: 'Banner created successfully', banner });
};

/**
 * @desc   Update a banner (admin)
 * @route  PUT /api/banners/:id
 * @access Private/Admin
 */
const updateBanner = async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  const banner = await Banner.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }

  res.status(200).json({ success: true, message: 'Banner updated successfully', banner });
};

/**
 * @desc   Delete a banner (admin)
 * @route  DELETE /api/banners/:id
 * @access Private/Admin
 */
const deleteBanner = async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }

  res.status(200).json({ success: true, message: 'Banner deleted successfully' });
};

module.exports = { getBanners, getBannerById, createBanner, updateBanner, deleteBanner };
