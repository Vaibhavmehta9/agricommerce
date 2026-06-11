const HomepageContent = require('../models/HomepageContent');

/**
 * @desc   Get homepage content (singleton)
 * @route  GET /api/homepage
 * @access Public
 */
const getHomepage = async (req, res) => {
  const content = await HomepageContent.findOne()
    .populate('featuredCategories', 'name slug image status')
    .populate('featuredProducts', 'name slug images price shortDescription status category')
    .populate({
      path: 'featuredProducts',
      populate: { path: 'category', select: 'name slug' },
    })
    .populate('testimonials', 'name role content avatar rating status');

  if (!content) {
    return res.status(200).json({ success: true, content: null });
  }

  res.status(200).json({ success: true, content });
};

/**
 * @desc   Update homepage content (singleton upsert)
 * @route  PUT /api/homepage
 * @access Private/Admin
 */
const updateHomepage = async (req, res) => {
  const content = await HomepageContent.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  })
    .populate('featuredCategories', 'name slug image status')
    .populate('featuredProducts', 'name slug images price shortDescription status')
    .populate('testimonials', 'name role content avatar rating status');

  res.status(200).json({ success: true, message: 'Homepage content updated successfully', content });
};

module.exports = { getHomepage, updateHomepage };
