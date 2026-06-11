import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import { useCart } from '../../context/CartContext'
import { useMode } from '../../context/ModeContext'
import { formatPrice, getImageUrl } from '../../utils/formatPrice'

function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const { isB2B } = useMode()
  const navigate = useNavigate()

  // B2B users shouldn't use cart
  if (isB2B) {
    return (
      <PageWrapper title="Cart">
        <CustomerLayout>
          <div className="max-w-2xl mx-auto text-center py-24 px-4">
            <div className="text-6xl mb-6">📋</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">You're in Wholesale Mode</h1>
            <p className="text-gray-500 mb-6">
              In wholesale mode, please use our enquiry form to request bulk quotes and place orders.
            </p>
            <Link to="/enquiry" className="btn-primary inline-flex items-center gap-2">
              Request a Quote <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CustomerLayout>
      </PageWrapper>
    )
  }

  const total = getTotal()

  return (
    <PageWrapper title="Cart">
      <CustomerLayout>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <FiShoppingBag className="w-7 h-7" />
              Shopping Cart
              {items.length > 0 && (
                <span className="text-lg font-medium text-green-200">({items.length} item{items.length !== 1 ? 's' : ''})</span>
              )}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length === 0 ? (
            /* Empty cart */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Looks like you haven't added any products yet. Start shopping for fresh farm produce!
              </p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2 text-base">
                <FiShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Header row */}
                <div className="hidden sm:flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide pb-2 border-b border-gray-200">
                  <span>Product</span>
                  <div className="flex items-center gap-16">
                    <span>Quantity</span>
                    <span>Total</span>
                    <span className="w-8" />
                  </div>
                </div>

                {items.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  >
                    {/* Image */}
                    <Link to={`/products/${product.slug}`} className="flex-shrink-0">
                      <img
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80' }}
                      />
                    </Link>

                    {/* Name + price */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="font-bold text-gray-800 hover:text-green-700 transition-colors truncate">{product.name}</h3>
                      </Link>
                      {product.category?.name && (
                        <p className="text-gray-500 text-xs mt-0.5">{product.category.name}</p>
                      )}
                      <p className="text-green-700 font-semibold mt-1 sm:hidden">{formatPrice(product.price)}</p>
                    </div>

                    {/* Quantity + total + remove */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => quantity === 1 ? removeFromCart(product._id) : updateQuantity(product._id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-800">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item total */}
                      <span className="text-green-700 font-bold text-base min-w-[80px] text-right hidden sm:block">
                        {formatPrice(product.price * quantity)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ml-auto sm:ml-0"
                        title="Remove item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear cart + continue shopping */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4">
                  <Link
                    to="/products"
                    className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold text-sm transition-colors"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                  <h2 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h2>

                  <div className="space-y-3 mb-5">
                    {items.map(({ product, quantity }) => (
                      <div key={product._id} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate flex-1 mr-2">
                          {product.name} <span className="text-gray-400">× {quantity}</span>
                        </span>
                        <span className="font-medium text-gray-800 flex-shrink-0">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Subtotal</span>
                      <span className="font-medium text-gray-800">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500 text-sm">Shipping</span>
                      <span className="text-green-600 font-medium text-sm">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-black text-green-700 text-xl">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full flex items-center justify-center gap-2 btn-primary text-base py-3"
                  >
                    Proceed to Checkout
                    <FiArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-3">
                    Secure checkout • Cash on delivery available
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default CartPage
