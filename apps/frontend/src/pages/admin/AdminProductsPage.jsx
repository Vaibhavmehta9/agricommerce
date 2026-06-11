import React, { useState, useEffect } from 'react'
import { FiPlus, FiX, FiPackage, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import ImageUploader from '../../components/admin/ImageUploader'
import CMSEditor from '../../components/admin/CMSEditor'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productsAPI'
import { getCategories } from '../../api/categoriesAPI'
import { formatPrice, getImageUrl } from '../../utils/formatPrice'

const initialForm = {
  name: '',
  category: '',
  shortDescription: '',
  description: '',
  price: '',
  stock: '',
  b2bVisible: true,
  b2cVisible: true,
  status: 'active',
  images: [],
  specs: [],
}

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        getProducts({ limit: 100 }),
        getCategories({ limit: 100 }),
      ])
      if (prodRes.status === 'fulfilled') {
        const d = prodRes.value.data?.data || prodRes.value.data || []
        setProducts(Array.isArray(d) ? d : d.products || [])
      }
      if (catRes.status === 'fulfilled') {
        const d = catRes.value.data?.data || catRes.value.data || []
        setCategories(Array.isArray(d) ? d : d.categories || [])
      }
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => {
    setEditingProduct(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      category: product.category?._id || product.category || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      b2bVisible: product.b2bVisible !== false,
      b2cVisible: product.b2cVisible !== false,
      status: product.status || 'active',
      images: product.images || [],
      specs: Object.entries(product.specs || {}).map(([key, value]) => ({ key, value: String(value) })),
    })
    setModalOpen(true)
  }

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addSpec = () => setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }))
  const removeSpec = (i) => setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }))
  const updateSpec = (i, field, value) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((s, idx) => idx === i ? { ...s, [field]: value } : s),
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return }
    setSaving(true)
    try {
      const specsObj = {}
      form.specs.forEach(({ key, value }) => { if (key.trim()) specsObj[key.trim()] = value })
      const payload = { ...form, specs: specsObj, price: Number(form.price), stock: Number(form.stock) }

      if (editingProduct) {
        await updateProduct(editingProduct._id, payload)
        toast.success('Product updated!')
      } else {
        await createProduct(payload)
        toast.success('Product created!')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      await deleteProduct(deleteModal._id)
      toast.success('Product deleted')
      setDeleteModal(null)
      fetchData()
    } catch (err) {
      toast.error('Failed to delete product')
    } finally { setDeleting(false) }
  }

  const columns = [
    {
      key: 'images', label: 'Image',
      render: (images) => (
        <img src={getImageUrl(images?.[0])} alt="" className="w-10 h-10 object-cover rounded-lg border border-gray-100"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }} />
      ),
    },
    { key: 'name', label: 'Name' },
    {
      key: 'category', label: 'Category',
      render: (cat) => <span>{cat?.name || cat || '—'}</span>,
    },
    {
      key: 'price', label: 'Price',
      render: (price) => <span className="text-green-700 font-semibold">{price ? formatPrice(price) : '—'}</span>,
    },
    { key: 'stock', label: 'Stock' },
    {
      key: 'status', label: 'Status',
      render: (status) => (
        <span className={status === 'active' ? 'badge-green' : 'badge-red'}>{status}</span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 btn-primary">
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={products}
        onEdit={openEdit}
        onDelete={setDeleteModal}
        isLoading={loading}
        emptyMessage="No products yet. Add your first product!"
        emptyIcon={<FiPackage className="w-12 h-12" />}
      />

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Images */}
              <ImageUploader
                label="Product Images"
                multiple
                currentImages={form.images}
                onUpload={(urls) => handleFormChange('images', urls)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Product Name *</label>
                  <input value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="e.g. Organic Basmati Rice" className="input-field" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={(e) => handleFormChange('category', e.target.value)} className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} placeholder="0.00" min="0" className="input-field" />
                </div>
                <div>
                  <label className="label">Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={(e) => handleFormChange('stock', e.target.value)} placeholder="0" min="0" className="input-field" />
                </div>
              </div>

              <div>
                <label className="label">Short Description</label>
                <textarea value={form.shortDescription} onChange={(e) => handleFormChange('shortDescription', e.target.value)} placeholder="Brief product summary (shown in listings)" rows={2} className="input-field resize-none" />
              </div>

              <CMSEditor
                label="Full Description"
                value={form.description}
                onChange={(v) => handleFormChange('description', v)}
                rows={8}
                placeholder="Full product description (HTML supported)"
              />

              {/* Specs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Specifications</label>
                  <button onClick={addSpec} type="button" className="text-green-600 hover:text-green-800 text-xs font-semibold flex items-center gap-1">
                    <FiPlus className="w-3 h-3" /> Add Spec
                  </button>
                </div>
                <div className="space-y-2">
                  {form.specs.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} placeholder="Key (e.g. Weight)" className="input-field flex-1" />
                      <input value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} placeholder="Value (e.g. 25 kg)" className="input-field flex-1" />
                      <button onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600 p-2">
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visibility & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={(e) => handleFormChange('status', e.target.value)} className="input-field">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="b2c" checked={form.b2cVisible} onChange={(e) => handleFormChange('b2cVisible', e.target.checked)} className="w-4 h-4 accent-green-600" />
                  <label htmlFor="b2c" className="text-sm font-medium text-gray-700">B2C Visible</label>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="b2b" checked={form.b2bVisible} onChange={(e) => handleFormChange('b2bVisible', e.target.checked)} className="w-4 h-4 accent-green-600" />
                  <label htmlFor="b2b" className="text-sm font-medium text-gray-700">B2B Visible</label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0">
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <strong>"{deleteModal.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteModal(null)} className="btn-secondary px-5">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex items-center gap-2">
                {deleting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductsPage
