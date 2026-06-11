import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiLayout,
  FiImage,
  FiFileText,
  FiMessageSquare,
  FiShoppingBag,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiDroplet,
  FiChevronRight,
  FiUser,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import ErrorBoundary from '../common/ErrorBoundary'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/categories', label: 'Categories', icon: FiGrid },
  { to: '/admin/homepage', label: 'Homepage', icon: FiLayout },
  { to: '/admin/banners', label: 'Banners', icon: FiImage },
  { to: '/admin/cms', label: 'CMS Pages', icon: FiFileText },
  { to: '/admin/enquiries', label: 'Enquiries', icon: FiMessageSquare },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
]

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 p-5 border-b border-green-900">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <FiDroplet className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <div className="leading-tight overflow-hidden">
            <span className="font-black text-white text-lg tracking-tight">Agri</span>
            <span className="font-black text-amber-300 text-lg tracking-tight">Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 transition-all duration-200 group ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-green-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium truncate">{label}</span>
            )}
            {sidebarOpen && (
              <FiChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-green-900">
        {sidebarOpen && user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{user.name || 'Admin'}</p>
              <p className="text-green-300 text-xs truncate">{user.email || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 mx-0 rounded-xl w-full text-green-200 hover:bg-white/10 hover:text-white transition-all"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-gradient-to-b from-green-800 to-green-900 transition-all duration-300 ${
            sidebarOpen ? 'w-60' : 'w-16'
          } flex-shrink-0`}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-800 to-green-900 transform transition-transform duration-300 md:hidden ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <FiMenu className="w-5 h-5" />
              </button>

              {/* Desktop sidebar toggle */}
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>

              <span className="text-gray-800 font-semibold text-sm hidden sm:block">
                Admin Panel
              </span>
            </div>

            {/* Top bar right */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
                  <FiUser className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-green-800 text-sm font-semibold hidden sm:block">
                  {user?.name || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AdminLayout
