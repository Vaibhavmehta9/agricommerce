import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiCheck, FiArrowRight } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import { useCart } from '../../context/CartContext'
import { useMode } from '../../context/ModeContext'
import { placeOrder } from '../../api/ordersAPI'
import { formatPrice, getImageUrl } from '../../utils/formatPrice'
import { isValidEmail, isValidPhone, isRequired } from '../../utils/validators'
import toast from 'react-hot-toast'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
}

function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const { isB2B } = useMode()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  if (isB2B) {
    return (
      <PageWrapper title="Checkout">
        <CustomerLayout>
          <div className="max-w-xl mx-auto text-center py-24 px-4">
            <div className="text-6xl mb-6">📋</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Wholesale Mode Active</h1>
            <p className="text-gray-500 mb-6">Please use our enquiry form for bulk orders and we'll provide you with custom pricing.</p>
            <Link to="/enquiry" className="btn-primary inline-flex items-center gap-2">
              Send Enquiry <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CustomerLayout>
      </PageWrapper>
    )
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <PageWrapper title="Checkout">
        <CustomerLayout>
          <div className="max-w-xl mx-auto text-center py-24 px-4">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h1>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        </CustomerLayout>
      </PageWrapper>
    )
  }

  const validate = () => {
    const e = {}
    if (!isRequired(form.name)) e.name = 'Full name is required'
    if (!isRequired(form.email)) e.email = 'Email is required'
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email'
    if (!isRequired(form.phone)) e.phone = 'Phone is required'
    else if (!isValidPhone(form.phone)) e.phone = 'Enter a valid phone number'
    if (!isRequired(form.street)) e.street = 'Street address is required'
    if (!isRequired(form.city)) e.city = 'City is required'
    if (!isRequired(form.state)) e.state = 'State is required'
    if (!isRequired(form.pincode)) e.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        },
        items: items.map(({ product, quantity }) => ({
          product: product._id,
          name: product.name,
          quantity,
          price: product.price,
        })),
        total: getTotal(),
        notes: form.notes,
      }
      const res = await placeOrder(orderData)
      const id = res.data?.data?._id || res.data?.order?._id || res.data?._id
      setOrderId(id)
      clearCart()
      setOrderPlaced(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <PageWrapper title="Order Confirmed">
        <CustomerLayout>
          <div className="max-w-lg mx-auto text-center py-20 px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-800 mb-3">Order Placed!</h1>
            <p className="text-gray-500 mb-2">
              Thank you for your order. We'll process it and send you a confirmation email shortly.
            </p>
            {orderId && (
              <p className="text-sm text-green-700 font-medium bg-green-50 rounded-lg px-4 py-2 mb-6 inline-block">
                Order ID: {orderId}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </CustomerLayout>
      </PageWrapper>
    )
  }

  const total = getTotal()

  return (
    <PageWrapper title="Checkout">
      <CustomerLayout>
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-black text-white">Checkout</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Customer details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-800 text-lg mb-5">Contact Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`} />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="label">Email <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`} />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">Phone <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={`input-field pl-10 ${errors.phone ? 'border-red-400' : ''}`} />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-800 text-lg mb-5">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Street Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                        <textarea name="street" value={form.street} onChange={handleChange} placeholder="House/Flat no., Street, Area" rows={2} className={`input-field pl-10 resize-none ${errors.street ? 'border-red-400' : ''}`} />
                      </div>
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="label">City <span className="text-red-500">*</span></label>
                        <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className={`input-field ${errors.city ? 'border-red-400' : ''}`} />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="label">State <span className="text-red-500">*</span></label>
                        <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" className={`input-field ${errors.state ? 'border-red-400' : ''}`} />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="label">Pincode <span className="text-red-500">*</span></label>
                        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" maxLength={6} className={`input-field ${errors.pincode ? 'border-red-400' : ''}`} />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label">Order Notes (optional)</label>
                      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Delivery instructions, special requests..." rows={2} className="input-field resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Order summary */}
              <div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                  <h2 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h2>

                  <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                    {items.map(({ product, quantity }) => (
                      <div key={product._id} className="flex items-center gap-3">
                        <img
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-green-600 font-medium">TBD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-black text-green-700 text-xl">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold py-3.5 rounded-2xl transition-all text-base shadow-lg hover:shadow-xl active:scale-95"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <FiCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <Link to="/cart" className="flex items-center justify-center gap-1.5 text-green-700 hover:text-green-900 text-sm font-medium mt-3 transition-colors">
                    <FiArrowLeft className="w-3.5 h-3.5" />
                    Back to Cart
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default CheckoutPage
