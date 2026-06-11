import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Customer pages
import HomePage from '../pages/customer/HomePage'
import ProductsPage from '../pages/customer/ProductsPage'
import ProductDetailPage from '../pages/customer/ProductDetailPage'
import CartPage from '../pages/customer/CartPage'
import CheckoutPage from '../pages/customer/CheckoutPage'
import EnquiryPage from '../pages/customer/EnquiryPage'
import CMSPageView from '../pages/customer/CMSPageView'
import NotFoundPage from '../pages/customer/NotFoundPage'

// Admin pages
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import DashboardPage from '../pages/admin/DashboardPage'
import AdminProductsPage from '../pages/admin/AdminProductsPage'
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage'
import AdminHomepagePage from '../pages/admin/AdminHomepagePage'
import AdminBannersPage from '../pages/admin/AdminBannersPage'
import AdminCMSPage from '../pages/admin/AdminCMSPage'
import AdminEnquiriesPage from '../pages/admin/AdminEnquiriesPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'

// Layouts
import AdminLayout from '../components/layout/AdminLayout'

// Private route guard
function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function AppRouter() {
  return (
    <Routes>
      {/* Public customer routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/enquiry" element={<EnquiryPage />} />
      <Route path="/pages/:slug" element={<CMSPageView />} />

      {/* Admin login (no layout) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin redirect */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Navigate to="/admin/dashboard" replace />
          </PrivateRoute>
        }
      />

      {/* Protected admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminCategoriesPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/homepage"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminHomepagePage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/banners"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminBannersPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/cms"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminCMSPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/cms/:slug"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminCMSPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminEnquiriesPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminSettingsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
