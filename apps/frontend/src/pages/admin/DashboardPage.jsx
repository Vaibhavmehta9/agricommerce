import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPackage, FiGrid, FiMessageSquare, FiShoppingBag,
  FiArrowRight, FiTrendingUp, FiClock,
} from 'react-icons/fi'
import { getProducts } from '../../api/productsAPI'
import { getCategories } from '../../api/categoriesAPI'
import { getEnquiries } from '../../api/enquiriesAPI'
import { getOrders } from '../../api/ordersAPI'
import { formatPrice, formatDateTime, getImageUrl } from '../../utils/formatPrice'

const STATUS_COLORS = {
  New: 'badge-blue',
  'In Progress': 'badge-yellow',
  Resolved: 'badge-green',
  Pending: 'badge-yellow',
  Processing: 'badge-blue',
  Shipped: 'badge-blue',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
}

function StatCard({ icon: Icon, label, value, color, loading, to }) {
  return (
    <Link to={to} className="block group">
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group-hover:border-${color}-200`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse mb-1" />
        ) : (
          <div className="text-3xl font-black text-gray-800 mb-1">{value}</div>
        )}
        <p className="text-gray-500 text-sm font-medium">{label}</p>
      </div>
    </Link>
  )
}

function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, enquiries: 0, orders: 0 })
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, catRes, enqRes, ordRes] = await Promise.allSettled([
          getProducts({ limit: 1 }),
          getCategories({ limit: 1 }),
          getEnquiries({ status: 'New', limit: 1 }),
          getOrders({ status: 'Pending', limit: 1 }),
        ])

        const getCount = (res) => {
          if (res.status === 'fulfilled') {
            const d = res.value.data
            return d?.total || d?.count || d?.data?.length || 0
          }
          return 0
        }

        setStats({
          products: getCount(prodRes),
          categories: getCount(catRes),
          enquiries: getCount(enqRes),
          orders: getCount(ordRes),
        })

        // Fetch recent items
        const [recentEnqRes, recentOrdRes] = await Promise.allSettled([
          getEnquiries({ limit: 5, sort: '-createdAt' }),
          getOrders({ limit: 5, sort: '-createdAt' }),
        ])

        if (recentEnqRes.status === 'fulfilled') {
          const d = recentEnqRes.value.data?.data || recentEnqRes.value.data || []
          setRecentEnquiries(Array.isArray(d) ? d : d.enquiries || [])
        }
        if (recentOrdRes.status === 'fulfilled') {
          const d = recentOrdRes.value.data?.data || recentOrdRes.value.data || []
          setRecentOrders(Array.isArray(d) ? d : d.orders || [])
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={FiPackage} label="Total Products" value={stats.products} color="green" loading={loading} to="/admin/products" />
        <StatCard icon={FiGrid} label="Total Categories" value={stats.categories} color="blue" loading={loading} to="/admin/categories" />
        <StatCard icon={FiMessageSquare} label="New Enquiries" value={stats.enquiries} color="amber" loading={loading} to="/admin/enquiries" />
        <StatCard icon={FiShoppingBag} label="Pending Orders" value={stats.orders} color="red" loading={loading} to="/admin/orders" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-gray-800">Recent Enquiries</h2>
            </div>
            <Link to="/admin/enquiries" className="text-green-600 hover:text-green-800 text-xs font-semibold flex items-center gap-1">
              View All <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentEnquiries.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No enquiries yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentEnquiries.map((enq) => {
                const imgUrl = getImageUrl(enq.productRef?.images?.[0])
                return (
                  <div key={enq._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                        <img
                          src={imgUrl}
                          alt={enq.productName || 'Enquiry'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&q=80'
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm leading-tight">{enq.companyName || enq.contactPerson}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{enq.productName} • {formatDateTime(enq.createdAt)}</p>
                      </div>
                    </div>
                    <span className={STATUS_COLORS[enq.status] || 'badge-blue'}>
                      {enq.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="w-5 h-5 text-green-600" />
              <h2 className="font-bold text-gray-800">Recent Orders</h2>
            </div>
            <Link to="/admin/orders" className="text-green-600 hover:text-green-800 text-xs font-semibold flex items-center gap-1">
              View All <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No orders yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const firstItem = order.items?.[0]
                const imgUrl = getImageUrl(firstItem?.product?.images?.[0])
                return (
                  <div key={order._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                        <img
                          src={imgUrl}
                          alt={firstItem?.name || 'Order'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&q=80'
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm leading-tight">{order.customer?.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {order.items?.length || 0} item(s) • {formatPrice(order.total)} • {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className={STATUS_COLORS[order.status] || 'badge-yellow'}>
                      {order.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
