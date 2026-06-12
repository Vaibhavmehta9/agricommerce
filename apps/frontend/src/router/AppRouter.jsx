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
import LoginPage from '../pages/customer/LoginPage'
import RegisterPage from '../pages/customer/RegisterPage'
import MyOrdersPage from '../pages/customer/MyOrdersPage'
import TrackOrderPage from '../pages/customer/TrackOrderPage'
import ContactPage from '../pages/customer/ContactPage'

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
function PrivateRoute({ children, redirectTo = "/admin/login" }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

// Admin only route guard
function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading..." />
  }

  if (!isAuthenticated || user?.role !== 'admin') {
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
      <Route path="/pages/contact" element={<ContactPage />} />
      <Route path="/pages/:slug" element={<CMSPageView />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route
        path="/my-orders"
        element={
          <PrivateRoute redirectTo="/login">
            <MyOrdersPage />
          </PrivateRoute>
        }
      />

      {/* Admin login (no layout) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin redirect */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" replace />
          </AdminRoute>
        }
      />

      {/* Protected admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCategoriesPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/homepage"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminHomepagePage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/banners"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminBannersPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/cms"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCMSPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/cms/:slug"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCMSPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminEnquiriesPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminSettingsPage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
