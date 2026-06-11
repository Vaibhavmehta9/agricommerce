const SiteSettings = require('../models/SiteSettings');

/**
 * @desc   Get site settings (singleton)
 * @route  GET /api/settings
 * @access Public
 */
const getSettings = async (req, res) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    // Return defaults if no settings exist yet
    settings = {
      siteName: 'AgriCommerce',
      defaultMode: 'b2c',
      contactInfo: {},
      socialLinks: {},
      businessDetails: {},
      seoDefaults: {},
    };
  }

  res.status(200).json({ success: true, settings });
};

/**
 * @desc   Update site settings (singleton upsert)
 * @route  PUT /api/settings
 * @access Private/Admin
 */
const updateSettings = async (req, res) => {
  // Handle logo and favicon uploads
  const data = { ...req.body };

  if (req.files) {
    if (req.files.logo) {
      data.logo = `/uploads/${req.files.logo[0].filename}`;
    }
    if (req.files.favicon) {
      data.favicon = `/uploads/${req.files.favicon[0].filename}`;
    }
  }

  const settings = await SiteSettings.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
};

module.exports = { getSettings, updateSettings };
