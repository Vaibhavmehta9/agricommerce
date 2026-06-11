import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch, FiFilter, FiX, FiGrid, FiList, FiPackage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import ProductCard from '../../components/common/ProductCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useMode } from '../../context/ModeContext'
import { getProducts } from '../../api/productsAPI'
import { getCategories } from '../../api/categoriesAPI'

const ITEMS_PER_PAGE = 12

function ProductsPage() {
  const { isB2B } = useMode()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // URL-synced filters
  const searchQuery = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  // Fetch categories once
  useEffect(() => {
    getCategories({ status: 'active' })
      .then((res) => {
        const data = res.data?.data || res.data || []
        setCategories(Array.isArray(data) ? data : data.categories || [])
      })
      .catch(() => {})
  }, [])

  // Fetch products on filter change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {
          page,
          limit: ITEMS_PER_PAGE,
          status: 'active',
        }
        if (searchQuery) params.search = searchQuery
        if (selectedCategory) params.category = selectedCategory
        if (isB2B) params.b2bVisible = true
        else params.b2cVisible = true

        const res = await getProducts(params)
        const data = res.data?.data || res.data
        if (Array.isArray(data)) {
          setProducts(data)
          setTotal(data.length)
        } else {
          setProducts(data?.products || [])
          setTotal(data?.total || data?.count || 0)
        }
      } catch {
        setProducts([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery, selectedCategory, page, isB2B])

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Search</h3>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search products..."
            className="input-field pl-9 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => updateParam('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => updateParam('category', '')}
              className="accent-green-600"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat._id}
                onChange={() => updateParam('category', cat._id)}
                className="accent-green-600"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-800">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(searchQuery || selectedCategory) && (
        <button
          onClick={() => setSearchParams({})}
          className="w-full text-sm text-red-500 hover:text-red-700 flex items-center justify-center gap-1.5 py-2 border border-red-200 rounded-lg hover:border-red-300 transition-colors"
        >
          <FiX className="w-3.5 h-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <PageWrapper title="Products">
      <CustomerLayout>
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
              {isB2B ? 'Wholesale Products' : 'All Products'}
            </h1>
            <p className="text-green-200">
              {isB2B ? 'Bulk pricing available for all products' : 'Fresh, organic, and sustainably sourced'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <FilterSidebar />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <FiFilter className="w-4 h-4" />
                    Filters
                  </button>
                  <p className="text-gray-500 text-sm">
                    {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active filters */}
              {(searchQuery || selectedCategory) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchQuery && (
                    <span className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                      Search: "{searchQuery}"
                      <button onClick={() => updateParam('search', '')}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                      {categories.find(c => c._id === selectedCategory)?.name || 'Category'}
                      <button onClick={() => updateParam('category', '')}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Products grid */}
              {loading ? (
                <LoadingSpinner />
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPackage className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button onClick={() => setSearchParams({})} className="btn-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
                }>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => updateParam('page', String(page - 1))}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                        p === page
                          ? 'bg-green-700 text-white shadow-md'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => updateParam('page', String(page + 1))}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-800 text-lg">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}
      </CustomerLayout>
    </PageWrapper>
  )
}

export default ProductsPage
