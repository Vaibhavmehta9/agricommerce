import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiMenu, FiX, FiDroplet } from 'react-icons/fi'
import ModeToggle from '../common/ModeToggle'
import { useCart } from '../../context/CartContext'
import { useMode } from '../../context/ModeContext'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const { getCount } = useCart()
  const { isB2B } = useMode()
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const cartCount = getCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/track-order', label: 'Track Order' },
  ]

  if (isAuthenticated) {
    links.push({ to: '/my-orders', label: 'My Orders' })
  }

  links.push({ to: '/pages/about', label: 'About' })
  links.push({ to: '/pages/contact', label: 'Contact' })

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <FiDroplet className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-green-800 text-xl tracking-tight">Agri</span>
              <span className="font-black text-amber-500 text-xl tracking-tight">Commerce</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side: ModeToggle + Cart + Auth + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* Cart icon (B2C only) */}
            {!isB2B && (
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                aria-label={`Cart (${cartCount} items)`}
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* B2B Enquiry link */}
            {isB2B && (
              <Link
                to="/enquiry"
                className="hidden sm:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors shadow-sm"
              >
                Get Quote
              </Link>
            )}

            {/* Auth Button (Desktop) */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Log In
              </Link>
            )}

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Mobile ModeToggle */}
            <div className="px-4 py-3 border-t border-gray-100 mt-2">
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Shopping Mode</p>
              <ModeToggle />
            </div>

            {isB2B && (
              <Link
                to="/enquiry"
                className="block text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors mt-2"
              >
                Request Bulk Quote
              </Link>
            )}

            {!isB2B && (
              <Link
                to="/cart"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                <FiShoppingCart className="w-4 h-4" />
                Cart
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Auth Button */}
            <div className="px-4 py-3 border-t border-gray-100 mt-2">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="w-full text-center bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
