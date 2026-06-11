const mongoose = require('mongoose');

const cmsPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    body: {
      type: String,
      default: '',
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CMSPage', cmsPageSchema);
