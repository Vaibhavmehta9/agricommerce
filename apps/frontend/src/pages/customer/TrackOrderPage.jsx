import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FiSearch, FiFileText, FiMapPin, FiTruck, FiCheck, FiXCircle, FiCornerUpLeft, FiUser, FiCalendar, FiClock } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { trackOrder, cancelOrder, returnOrder } from '../../api/ordersAPI'
import { formatPrice, getImageUrl } from '../../utils/formatPrice'
import toast from 'react-hot-toast'

function TrackOrderPage() {
  const location = useLocation()
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Automatically trigger search if order details passed via location state
  useEffect(() => {
    if (location.state?.orderId && location.state?.email) {
      setOrderId(location.state.orderId)
      setEmail(location.state.email)
      handleTrack(location.state.orderId, location.state.email)
    }
  }, [location.state])

  const handleTrack = async (targetId = orderId, targetEmail = email) => {
    if (!targetId.trim() || !targetEmail.trim()) {
      toast.error('Please enter both Order ID and Email')
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      const res = await trackOrder(targetId.trim(), targetEmail.trim())
      setOrder(res.data?.order || res.data)
    } catch (err) {
      setOrder(null)
      toast.error(err.response?.data?.message || 'Could not find order. Please verify details.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    setActionLoading(true)
    try {
      // Pass email verification in body for guest cancellation authorization
      await cancelOrder(order._id, order.customer.email)
      toast.success('Order cancelled successfully!')
      // Refresh order status
      handleTrack(order._id, order.customer.email)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReturn = async () => {
    if (!window.confirm('Are you sure you want to request a return for this order?')) return

    setActionLoading(true)
    try {
      // Pass email verification in body for guest return authorization
      await returnOrder(order._id, order.customer.email)
      toast.success('Return request submitted successfully!')
      // Refresh order status
      handleTrack(order._id, order.customer.email)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request return.')
    } finally {
      setActionLoading(false)
    }
  }

  // Helper to determine status step active state
  const getStepStatus = (stepName) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered']
    const currentIndex = statuses.indexOf(order.status)
    const stepIndex = statuses.indexOf(stepName)

    if (order.status === 'Cancelled' || order.status === 'Returned' || order.status === 'Return Requested') {
      return 'inactive'
    }

    if (currentIndex >= stepIndex) {
      return 'completed'
    }
    return 'upcoming'
  }

  const renderTimeline = () => {
    if (['Cancelled', 'Return Requested', 'Returned'].includes(order.status)) {
      return (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center mt-4">
          <p className="text-red-700 font-extrabold text-lg flex items-center justify-center gap-2">
            {order.status === 'Cancelled' ? (
              <>✕ Order Cancelled</>
            ) : order.status === 'Return Requested' ? (
              <>↩ Return Request Submitted</>
            ) : (
              <>↩ Product Returned</>
            )}
          </p>
          <p className="text-red-500 text-xs mt-1">
            {order.status === 'Cancelled'
              ? 'This order has been cancelled and inventory was restored.'
              : 'Our customer care executive will contact you shortly regarding the return.'}
          </p>
        </div>
      )
    }

    const steps = [
      { name: 'Pending', label: 'Order Received', icon: FiFileText, desc: 'We have received your order.' },
      { name: 'Processing', label: 'Processing', icon: FiClock, desc: 'Your organic produce is being packed.' },
      { name: 'Shipped', label: 'Out for Delivery', icon: FiTruck, desc: 'Your order is on its way to you.' },
      { name: 'Delivered', label: 'Delivered', icon: FiCheck, desc: 'Order reached its destination.' },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 relative">
        {/* Progress Line (Desktop) */}
        <div className="absolute top-[26px] left-[12.5%] right-[12.5%] h-1 bg-gray-200 hidden md:block z-0" />

        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.name)
          const StepIcon = step.icon

          // Determine line progress
          let progressLineClass = 'bg-gray-200'
          if (stepStatus === 'completed') {
            progressLineClass = 'bg-green-600'
          }

          return (
            <div key={idx} className="flex flex-col items-center text-center z-10">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  stepStatus === 'completed'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                <StepIcon className="w-6 h-6" />
              </div>
              <h4 className={`text-sm font-bold mt-3 ${stepStatus === 'completed' ? 'text-green-800' : 'text-gray-500'}`}>
                {step.label}
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-[150px]">{step.desc}</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <PageWrapper title="Track Order">
      <CustomerLayout>
        {/* Banner */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Track Your Order</h1>
            <p className="text-green-200">Enter your order ID and matching customer email address to view status and progress</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Tracker Search Input */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleTrack()
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              <div>
                <label className="label">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 647ac8..."
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="label">Customer Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="input-field text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-sm h-12 shadow-md hover:shadow-lg w-full"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSearch className="w-4 h-4" />
                )}
                Track Order
              </button>
            </form>
          </div>

          {/* Search Result */}
          {loading ? (
            <LoadingSpinner message="Searching order database..." />
          ) : searched && !order ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiXCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-700">Order Not Found</h2>
              <p className="text-gray-500 text-sm mt-1">
                Please check the Order ID and Email address. Make sure there are no trailing spaces.
              </p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Tracker Visual status */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      Order Tracking
                      <span className="font-mono text-sm font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                        #{order._id}
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5" /> Order Date:{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-black text-green-700 bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                      Total: {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {renderTimeline()}
              </div>

              {/* Order Info & Delivery Address Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery details */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                    <FiMapPin className="text-green-700 w-4 h-4" /> Shipping Destination
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <FiUser className="text-gray-400 flex-shrink-0 w-4 h-4" />
                      <span className="font-semibold text-gray-800">{order.customer.name}</span>
                    </p>
                    <p className="pl-6 font-mono text-xs">{order.customer.phone}</p>
                    <div className="pl-6">
                      <p>{order.customer.address.street}</p>
                      <p>
                        {order.customer.address.city}, {order.customer.address.state}
                      </p>
                      <p className="font-semibold text-gray-700 mt-1">Pincode: {order.customer.address.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Items and notes */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                    <FiFileText className="text-green-700 w-4 h-4" /> Ordered Items
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={getImageUrl(item.product?.images?.[0])}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-400">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                        </div>
                        <span className="text-xs font-extrabold text-gray-700">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                      <span className="font-semibold text-gray-700">Notes:</span>
                      <p className="text-gray-500 italic mt-0.5">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions details */}
              {(['Pending', 'Processing'].includes(order.status) || order.status === 'Delivered') && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">Order Management</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.status === 'Delivered'
                        ? 'Want to return this order? Requests can be made up to 7 days from delivery.'
                        : 'You can cancel this order before we ship it.'}
                    </p>
                  </div>
                  <div>
                    {['Pending', 'Processing'].includes(order.status) ? (
                      <button
                        onClick={handleCancel}
                        disabled={actionLoading}
                        className="bg-red-50 hover:bg-red-100 text-red-600 disabled:bg-gray-100 disabled:text-gray-400 border border-red-100 hover:border-red-200 text-xs font-extrabold px-5 py-3 rounded-2xl flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        {actionLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiXCircle className="w-4 h-4" />
                        )}
                        Cancel Order
                      </button>
                    ) : (
                      <button
                        onClick={handleReturn}
                        disabled={actionLoading}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 disabled:bg-gray-100 disabled:text-gray-400 border border-indigo-100 hover:border-indigo-200 text-xs font-extrabold px-5 py-3 rounded-2xl flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        {actionLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiCornerUpLeft className="w-4 h-4" />
                        )}
                        Request Return
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <p className="text-gray-400 text-sm">
                Enter your order credentials above to retrieve tracking details.
              </p>
            </div>
          )}
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default TrackOrderPage
