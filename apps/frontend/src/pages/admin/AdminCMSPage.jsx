import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiSave, FiArrowLeft, FiFileText, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import CMSEditor from '../../components/admin/CMSEditor'
import { getCMSPage, updateCMSPage } from '../../api/cmsAPI'

const CMS_PAGES = [
  { slug: 'about', label: 'About Us' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Service' },
  { slug: 'shipping', label: 'Shipping Policy' },
  { slug: 'faq', label: 'FAQ' },
  { slug: 'refund', label: 'Refund Policy' },
]

function AdminCMSPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!slug) return
    const fetchPage = async () => {
      setLoading(true)
      try {
        const res = await getCMSPage(slug)
        const data = res.data?.data || res.data
        setPage(data)
        setTitle(data?.title || CMS_PAGES.find((p) => p.slug === slug)?.label || '')
        setBody(data?.body || data?.content || '')
      } catch {
        const found = CMS_PAGES.find((p) => p.slug === slug)
        setTitle(found?.label || slug)
        setBody('')
      } finally { setLoading(false) }
    }
    fetchPage()
  }, [slug])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateCMSPage(slug, { title, body })
      toast.success(`"${title}" saved!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save page')
    } finally { setSaving(false) }
  }

  // List view (no slug selected)
  if (!slug) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-gray-800">CMS Pages</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage content pages for your website</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CMS_PAGES.map(({ slug: pageSlug, label }) => (
            <Link
              key={pageSlug}
              to={`/admin/cms/${pageSlug}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-green-200 transition-all group flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                <FiFileText className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{label}</p>
                <p className="text-gray-400 text-xs font-mono">/pages/{pageSlug}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const pageInfo = CMS_PAGES.find((p) => p.slug === slug)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/cms')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-semibold transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-800">
            {pageInfo?.label || slug} — CMS Editor
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-0.5">
            Public URL: /pages/{slug}
          </p>
        </div>
        <button onClick={handleSave} disabled={saving || loading} className="btn-primary flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="label">Page Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title shown at the top"
              className="input-field text-lg font-semibold"
            />
          </div>

          <CMSEditor
            label="Page Content (HTML)"
            value={body}
            onChange={setBody}
            rows={24}
            placeholder={`Enter HTML content for the ${pageInfo?.label || slug} page...\n\nExample:\n<h2>About Us</h2>\n<p>We are AgriCommerce...</p>`}
          />
        </div>
      )}
    </div>
  )
}

export default AdminCMSPage
