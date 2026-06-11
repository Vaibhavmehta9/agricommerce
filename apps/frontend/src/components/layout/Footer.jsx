import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiDroplet,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi'

const footerLinks = {
  company: [
    { label: 'About Us', to: '/pages/about' },
    { label: 'Contact', to: '/pages/contact' },
    { label: 'Products', to: '/products' },
    { label: 'Request Quote', to: '/enquiry' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/pages/privacy-policy' },
    { label: 'Terms of Service', to: '/pages/terms' },
    { label: 'Shipping Policy', to: '/pages/shipping' },
    { label: 'FAQ', to: '/pages/faq' },
  ],
}

const socialIcons = [
  { icon: FiFacebook, label: 'Facebook', href: '#' },
  { icon: FiInstagram, label: 'Instagram', href: '#' },
  { icon: FiTwitter, label: 'Twitter', href: '#' },
  { icon: FiLinkedin, label: 'LinkedIn', href: '#' },
  { icon: FiYoutube, label: 'YouTube', href: '#' },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                <FiDroplet className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-white text-lg tracking-tight">Agri</span>
                <span className="font-black text-amber-400 text-lg tracking-tight">Commerce</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your trusted farm-fresh marketplace. Connecting farmers directly with buyers across India for fresh, organic, and sustainable agricultural products.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialIcons.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-green-700 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMail className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:hello@agricommerce.in"
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  hello@agricommerce.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Agri Lane, Farm District,<br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {currentYear} AgriCommerce. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Made with 🌿 for Indian farmers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
