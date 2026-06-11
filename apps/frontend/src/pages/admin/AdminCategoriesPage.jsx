import React, { useState, useEffect } from 'react'
import { FiPlus, FiX, FiGrid, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import ImageUploader from '../../components/admin/ImageUploader'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoriesAPI'
import { getImageUrl } from '../../utils/formatPrice'

const initialForm = { name: '', image: '', displayOrder: 0, status: 'active' }

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getCategories({ limit: 100 })
      const d = res.data?.data || res.data || []
      setCategories(Array.isArray(d) ? d : d.categories || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => { setEditingCategory(null); setForm(initialForm); setModalOpen(true) }

  const openEdit = (cat) => {
    setEditingCategory(cat)
    setForm({ name: cat.name || '', image: cat.image || '', displayOrder: cat.displayOrder || 0, status: cat.status || 'active' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Category name is required'); return }
    setSaving(true)
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, form)
        toast.success('Category updated!')
      } else {
        await createCategory(form)
        toast.success('Category created!')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      await deleteCategory(deleteModal._id)
      toast.success('Category deleted')
      setDeleteModal(null)
      fetchData()
    } catch {
      toast.error('Failed to delete category')
    } finally { setDeleting(false) }
  }

  const columns = [
    {
      key: 'image', label: 'Image',
      render: (img) => (
        <img src={getImageUrl(img)} alt="" className="w-10 h-10 object-cover rounded-lg border border-gray-100"
          onError={(e) => { e.target.style.display = 'none' }} />
      ),
    },
    { key: 'name', label: 'Name' },
    { key: 'displayOrder', label: 'Order' },
    {
      key: 'status', label: 'Status',
      render: (s) => <span className={s === 'active' ? 'badge-green' : 'badge-red'}>{s}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 btn-primary">
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={categories}
        onEdit={openEdit}
        onDelete={setDeleteModal}
        isLoading={loading}
        emptyMessage="No categories yet"
        emptyIcon={<FiGrid className="w-12 h-12" />}
      />

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <ImageUploader
                label="Category Image"
                currentImage={form.image}
                onUpload={(url) => setForm((p) => ({ ...p, image: url }))}
              />

              <div>
                <label className="label">Category Name *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Vegetables" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Display Order</label>
                  <input type="number" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))} min="0" className="input-field" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="input-field">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
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
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Category?</h3>
            <p className="text-gray-500 text-sm mb-6">Delete <strong>"{deleteModal.name}"</strong>? Products in this category won't be deleted.</p>
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

export default AdminCategoriesPage
