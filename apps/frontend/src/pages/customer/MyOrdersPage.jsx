import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPackage, FiTruck, FiXCircle, FiCornerUpLeft, FiEye, FiClock } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getMyOrders, cancelOrder, returnOrder } from '../../api/ordersAPI'
import { formatPrice, getImageUrl } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null) // tracks order ID undergoing cancel/return
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders()
      setOrders(res.data?.orders || [])
    } catch (err) {
      toast.error('Failed to load your orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    setActionLoading(orderId)
    try {
      await cancelOrder(orderId)
      toast.success('Order cancelled successfully!')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReturn = async (orderId) => {
    if (!window.confirm('Are you sure you want to request a return for this order?')) return

    setActionLoading(orderId)
    try {
      await returnOrder(orderId)
      toast.success('Return request submitted successfully!')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit return request.')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-amber-200"><FiClock className="w-3 h-3"/> Pending</span>
      case 'Processing':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-blue-200"><FiPackage className="w-3 h-3"/> Processing</span>
      case 'Shipped':
        return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-purple-200"><FiTruck className="w-3 h-3"/> Shipped</span>
      case 'Delivered':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-green-200">✓ Delivered</span>
      case 'Cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-red-200">✕ Cancelled</span>
      case 'Return Requested':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-indigo-200"><FiCornerUpLeft className="w-3 h-3"/> Return Requested</span>
      case 'Returned':
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 border border-gray-200">↩ Returned</span>
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">{status}</span>
    }
  }

  return (
    <PageWrapper title="My Orders">
      <CustomerLayout>
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">My Orders</h1>
            <p className="text-green-200">View your order history, track status, and request cancellations or returns</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <LoadingSpinner message="Loading your orders..." />
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">No orders placed yet</h2>
              <p className="text-gray-500 text-sm mb-8">Looks like you haven't ordered any fresh farm products yet.</p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                const isCancelable = ['Pending', 'Processing'].includes(order.status)
                const isReturnable = order.status === 'Delivered'
                const isOngoingAction = actionLoading === order._id

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="bg-gray-50/70 px-6 py-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Order Placed</p>
                        <p className="text-sm font-bold text-gray-700">{dateStr}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Amount</p>
                        <p className="text-sm font-black text-green-700">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Order ID</p>
                        <p className="text-sm font-mono font-medium text-gray-600">{order._id}</p>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-6 divide-y divide-gray-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                          <img
                            src={getImageUrl(item.product?.images?.[0])}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/64' }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-extrabold text-gray-800">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex flex-wrap justify-end gap-3">
                      <button
                        onClick={() => navigate('/track-order', { state: { orderId: order._id, email: order.customer?.email } })}
                        className="btn-secondary text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 font-bold"
                      >
                        <FiEye className="w-4 h-4" /> Track Status
                      </button>

                      {isCancelable && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={isOngoingAction}
                          className="bg-red-50 hover:bg-red-100 text-red-600 disabled:bg-gray-100 disabled:text-gray-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 font-bold transition-all border border-red-100 hover:border-red-200"
                        >
                          {isOngoingAction ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiXCircle className="w-4 h-4" />
                          )}
                          Cancel Order
                        </button>
                      )}

                      {isReturnable && (
                        <button
                          onClick={() => handleReturn(order._id)}
                          disabled={isOngoingAction}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 disabled:bg-gray-100 disabled:text-gray-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 font-bold transition-all border border-indigo-100 hover:border-indigo-200"
                        >
                          {isOngoingAction ? (
                            <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiCornerUpLeft className="w-4 h-4" />
                          )}
                          Request Return
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default MyOrdersPage
