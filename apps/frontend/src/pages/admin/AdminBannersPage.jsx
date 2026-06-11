import React, { useState, useEffect } from 'react'
import { FiPlus, FiX, FiImage, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import ImageUploader from '../../components/admin/ImageUploader'
import { getBanners, createBanner, updateBanner, deleteBanner } from '../../api/bannersAPI'
import { getImageUrl } from '../../utils/formatPrice'

const initialForm = {
  title: '', subtitle: '', image: '', link: '',
  buttonText: '', position: 'hero', status: 'active',
}

function AdminBannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editingBanner, setEditingBanner] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getBanners({ limit: 50 })
      const d = res.data?.data || res.data || []
      setBanners(Array.isArray(d) ? d : d.banners || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => { setEditingBanner(null); setForm(initialForm); setModalOpen(true) }
  const openEdit = (banner) => {
    setEditingBanner(banner)
    setForm({
      title: banner.title || '', subtitle: banner.subtitle || '',
      image: banner.image || '', link: banner.link || '',
      buttonText: banner.buttonText || '', position: banner.position || 'hero',
      status: banner.status || 'active',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      if (editingBanner) {
        await updateBanner(editingBanner._id, form)
        toast.success('Banner updated!')
      } else {
        await createBanner(form)
        toast.success('Banner created!')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      await deleteBanner(deleteModal._id)
      toast.success('Banner deleted')
      setDeleteModal(null)
      fetchData()
    } catch { toast.error('Failed to delete banner') }
    finally { setDeleting(false) }
  }

  const columns = [
    {
      key: 'image', label: 'Preview',
      render: (img) => (
        <img src={getImageUrl(img)} alt="" className="w-16 h-10 object-cover rounded-lg border border-gray-100"
          onError={(e) => { e.target.style.display = 'none' }} />
      ),
    },
    { key: 'title', label: 'Title' },
    { key: 'position', label: 'Position' },
    {
      key: 'status', label: 'Status',
      render: (s) => <span className={s === 'active' ? 'badge-green' : 'badge-red'}>{s}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Banners</h1>
          <p className="text-gray-500 text-sm mt-0.5">{banners.length} banners</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 btn-primary">
          <FiPlus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={banners}
        onEdit={openEdit}
        onDelete={setDeleteModal}
        isLoading={loading}
        emptyMessage="No banners yet"
        emptyIcon={<FiImage className="w-12 h-12" />}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <ImageUploader label="Banner Image" currentImage={form.image} onUpload={(url) => setForm((p) => ({ ...p, image: url }))} />
              <div>
                <label className="label">Title *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Banner headline" className="input-field" />
              </div>
              <div>
                <label className="label">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Banner subheading" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Link URL</label>
                  <input value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="/products" className="input-field" />
                </div>
                <div>
                  <label className="label">Button Text</label>
                  <input value={form.buttonText} onChange={(e) => setForm((p) => ({ ...p, buttonText: e.target.value }))} placeholder="Shop Now" className="input-field" />
                </div>
                <div>
                  <label className="label">Position</label>
                  <select value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))} className="input-field">
                    <option value="hero">Hero</option>
                    <option value="middle">Middle</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                  </select>
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
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0">
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? 'Saving...' : (editingBanner ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Delete Banner?</h3>
            <p className="text-gray-500 text-sm mb-6">Delete <strong>"{deleteModal.title}"</strong>? This cannot be undone.</p>
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

export default AdminBannersPage
