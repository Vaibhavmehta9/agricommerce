import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiEye, FiSend } from 'react-icons/fi'
import { useMode } from '../../context/ModeContext'
import { useCart } from '../../context/CartContext'
import { formatPrice, getImageUrl } from '../../utils/formatPrice'

function ProductCard({ product }) {
  const { isB2B } = useMode()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  if (!product) return null

  const {
    _id,
    name,
    slug,
    shortDescription,
    price,
    images,
    category,
    stock,
    status,
  } = product

  const imageUrl = getImageUrl(images?.[0])
  const isInStock = stock > 0 && status !== 'inactive'
  const categoryName = category?.name || category || ''

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isInStock) {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('This product is out of stock!')
      })
      return
    }
    if (addToCart(product, 1)) {
      navigate('/checkout')
    }
  }

  const handleRequestQuote = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate('/enquiry', { state: { productName: name } })
  }

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Image container */}
      <Link to={`/products/${slug}`} className="block overflow-hidden relative">
        <div className="h-52 overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80'
            }}
          />
        </div>
        {/* Stock badge */}
        <div className="absolute top-3 left-3">
          {isInStock ? (
            <span className="badge-green text-xs shadow-sm">In Stock</span>
          ) : (
            <span className="badge-red text-xs shadow-sm">Out of Stock</span>
          )}
        </div>
        {/* B2B badge */}
        {isB2B && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shadow-sm">
              Wholesale
            </span>
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 text-xs font-semibold py-1.5 px-3 rounded-full transition-all duration-300 flex items-center gap-1 shadow-lg">
            <FiEye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        {categoryName && (
          <span className="badge-green text-xs mb-2 self-start">{categoryName}</span>
        )}

        {/* Product name */}
        <Link to={`/products/${slug}`}>
          <h3 className="font-bold text-gray-800 text-base leading-snug mb-1 group-hover:text-green-700 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Short description */}
        {shortDescription && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">
            {shortDescription}
          </p>
        )}

        {/* Price and action */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          {isB2B ? (
            <button
              onClick={handleRequestQuote}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md active:scale-95"
            >
              <FiSend className="w-4 h-4" />
              Request Quote
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-green-700 font-bold text-lg">
                {formatPrice(price)}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex items-center gap-1.5 font-semibold py-2 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                  isInStock
                    ? 'bg-green-700 hover:bg-green-800 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart className="w-4 h-4" />
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
