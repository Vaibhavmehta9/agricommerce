const mongoose = require('mongoose');

const homepageContentSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      image: { type: String, default: '' },
      ctaText: { type: String, default: '' },
      ctaLink: { type: String, default: '' },
      secondaryCtaText: { type: String, default: '' },
      secondaryCtaLink: { type: String, default: '' },
    },
    featuredCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    featuredProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    sections: [
      {
        type: { type: String },
        title: { type: String },
        subtitle: { type: String },
        content: { type: String },
        image: { type: String },
        order: { type: Number, default: 0 },
      },
    ],
    whyChooseUs: [
      {
        icon: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    testimonials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Testimonial',
      },
    ],
    footer: {
      tagline: { type: String, default: '' },
      copyright: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomepageContent', homepageContentSchema);
