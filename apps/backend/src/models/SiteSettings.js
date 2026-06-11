const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'AgriCommerce',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    defaultMode: {
      type: String,
      enum: ['b2b', 'b2c'],
      default: 'b2c',
    },
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    businessDetails: {
      gstNumber: { type: String, default: '' },
      registrationNumber: { type: String, default: '' },
      bankDetails: { type: String, default: '' },
    },
    seoDefaults: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
