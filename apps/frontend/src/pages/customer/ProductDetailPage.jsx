import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiShoppingCart, FiSend, FiMinus, FiPlus, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import Breadcrumb from '../../components/common/Breadcrumb'
import ProductCard from '../../components/common/ProductCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EnquiryForm from '../../components/common/EnquiryForm'
import { useMode } from '../../context/ModeContext'
import { useCart } from '../../context/CartContext'
import { getProductBySlug, getProducts } from '../../api/productsAPI'
import { formatPrice, getImageUrl } from '../../utils/formatPrice'

function ProductDetailPage() {
  const { slug } = useParams()
  const { isB2B } = useMode()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getProductBySlug(slug)
        const data = res.data?.data || res.data
        setProduct(data)
        setSelectedImage(0)
        setQuantity(1)

        // Fetch related products
        if (data?.category?._id || data?.category) {
          const relRes = await getProducts({
            category: data.category?._id || data.category,
            limit: 4,
            status: 'active',
          })
          const relData = relRes.data?.data || relRes.data || []
          const arr = Array.isArray(relData) ? relData : relData.products || []
          setRelatedProducts(arr.filter((p) => p._id !== data._id).slice(0, 4))
        }
      } catch (err) {
        setError(err.response?.status === 404 ? 'Product not found.' : 'Failed to load product.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [slug])

  if (loading) {
    return (
      <PageWrapper title="Product">
        <CustomerLayout>
          <LoadingSpinner size="lg" fullScreen />
        </CustomerLayout>
      </PageWrapper>
    )
  }

  if (error || !product) {
    return (
      <PageWrapper title="Product Not Found">
        <CustomerLayout>
          <div className="max-w-lg mx-auto text-center py-24 px-4">
            <div className="text-8xl mb-6">🌿</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{error || 'Product not found'}</h1>
            <p className="text-gray-500 mb-6">This product may have been removed or the link is incorrect.</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Browse Products
            </button>
          </div>
        </CustomerLayout>
      </PageWrapper>
    )
  }

  const images = product.images?.length > 0 ? product.images : [null]
  const isInStock = product.stock > 0 && product.status !== 'inactive'
  const specs = product.specs || product.specifications || {}

  const handleAddToCart = () => {
    if (addToCart(product, quantity)) {
      navigate('/checkout')
    }
  }

  return (
    <PageWrapper title={product.name}>
      <CustomerLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Products', href: '/products' },
              { label: product.name },
            ]}
          />

          {/* Product detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
            {/* Left: Image gallery */}
            <div>
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square border border-gray-100 shadow-md mb-3">
                <img
                  src={getImageUrl(images[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80'
                  }}
                />
                {!isInStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white/90 text-gray-800 font-bold px-4 py-2 rounded-xl">Out of Stock</span>
                  </div>
                )}
                {/* Image nav */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === selectedImage ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex flex-col gap-5">
              {/* Category + stock */}
              <div className="flex items-center gap-2 flex-wrap">
                {(product.category?.name || product.category) && (
                  <span className="badge-green">{product.category?.name || product.category}</span>
                )}
                {isInStock ? (
                  <span className="badge-green">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="badge-red">Out of Stock</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-gray-600 text-base leading-relaxed">{product.shortDescription}</p>
              )}

              {/* Price (B2C) */}
              {!isB2B && product.price && (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-green-700">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Description</h3>
                  <div
                    className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Specs table */}
              {Object.keys(specs).length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    {Object.entries(specs).map(([key, value], i) => (
                      <div
                        key={key}
                        className={`flex items-center px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <span className="font-medium text-gray-600 w-1/3 capitalize">{key}</span>
                        <span className="text-gray-800 flex-1">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-100 pt-4">
                {isB2B ? (
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all text-lg shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <FiSend className="w-5 h-5" />
                    Send Enquiry for Bulk Order
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Quantity selector */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-700">Quantity</span>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
                        >
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
                        >
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!isInStock}
                      className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all text-lg shadow-lg hover:shadow-xl active:scale-95 ${
                        isInStock
                          ? 'bg-green-700 hover:bg-green-800 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      {isInStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Enquiry modal */}
        {enquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Send Bulk Enquiry</h2>
                <button
                  onClick={() => setEnquiryOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <EnquiryForm
                  initialProductName={product.name}
                  onSuccess={() => setEnquiryOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </CustomerLayout>
    </PageWrapper>
  )
}

export default ProductDetailPage
