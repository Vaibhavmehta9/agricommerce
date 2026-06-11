/**
 * @agricommerce/shared
 * Shared constants and utilities used by both frontend and backend
 */

// B2B/B2C Mode constants
export const MODES = {
  B2B: 'b2b',
  B2C: 'b2c',
};

// Order statuses
export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// Enquiry statuses
export const ENQUIRY_STATUSES = ['New', 'In Progress', 'Resolved'];

// CMS page slugs
export const CMS_SLUGS = ['about', 'contact', 'privacy-policy', 'terms', 'shipping', 'refund', 'faq'];

// CMS page display names
export const CMS_PAGE_NAMES = {
  about: 'About Us',
  contact: 'Contact Us',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
  shipping: 'Shipping Policy',
  refund: 'Refund Policy',
  faq: 'FAQ',
};
