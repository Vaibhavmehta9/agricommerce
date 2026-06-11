const CMSPage = require('../models/CMSPage');

/**
 * @desc   Get CMS page by slug
 * @route  GET /api/cms/:slug
 * @access Public
 */
const getCMSPage = async (req, res) => {
  const page = await CMSPage.findOne({ slug: req.params.slug.toLowerCase() });

  if (!page) {
    return res.status(404).json({ success: false, message: `CMS page '${req.params.slug}' not found` });
  }

  res.status(200).json({ success: true, page });
};

/**
 * @desc   Create or update CMS page by slug (upsert)
 * @route  PUT /api/cms/:slug
 * @access Private/Admin
 */
const upsertCMSPage = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const { title, body, metaTitle, metaDescription } = req.body;

  const page = await CMSPage.findOneAndUpdate(
    { slug },
    { slug, title, body, metaTitle, metaDescription },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, message: 'CMS page saved successfully', page });
};

module.exports = { getCMSPage, upsertCMSPage };
