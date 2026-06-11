import React, { useState, useEffect } from 'react'
import { FiSave, FiPlus, FiX, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getHomepage, updateHomepage } from '../../api/homepageAPI'
import { getCategories } from '../../api/categoriesAPI'
import { getProducts } from '../../api/productsAPI'
import ImageUploader from '../../components/admin/ImageUploader'

const defaultData = {
  hero: { title: '', subtitle: '', image: '', ctaText: 'Shop Now', ctaLink: '/products', secondaryCtaText: 'Request Quote', secondaryCtaLink: '/enquiry' },
  whyChooseUs: [],
  featuredCategories: [],
  featuredProducts: [],
  testimonials: [],
}

const ICON_OPTIONS = ['FiTruck', 'FiShield', 'FiAward', 'FiUsers', 'FiStar', 'FiHeart', 'FiGlobe', 'FiCheckCircle']

function AdminHomepagePage() {
  const [data, setData] = useState(defaultData)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [hpRes, catRes, prodRes] = await Promise.allSettled([
          getHomepage(),
          getCategories({ limit: 50, status: 'active' }),
          getProducts({ limit: 50, status: 'active' }),
        ])
        if (hpRes.status === 'fulfilled') {
          const d = hpRes.value.data?.data || hpRes.value.data
          if (d) setData({ ...defaultData, ...d })
        }
        if (catRes.status === 'fulfilled') {
          const d = catRes.value.data?.data || catRes.value.data || []
          setCategories(Array.isArray(d) ? d : d.categories || [])
        }
        if (prodRes.status === 'fulfilled') {
          const d = prodRes.value.data?.data || prodRes.value.data || []
          setProducts(Array.isArray(d) ? d : d.products || [])
        }
      } catch {}
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateHomepage(data)
      toast.success('Homepage updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update homepage')
    } finally { setSaving(false) }
  }

  const updateHero = (field, value) => setData((p) => ({ ...p, hero: { ...p.hero, [field]: value } }))

  const addWhyItem = () => setData((p) => ({ ...p, whyChooseUs: [...p.whyChooseUs, { icon: 'FiStar', title: '', description: '' }] }))
  const removeWhyItem = (i) => setData((p) => ({ ...p, whyChooseUs: p.whyChooseUs.filter((_, idx) => idx !== i) }))
  const updateWhyItem = (i, field, value) => setData((p) => ({
    ...p, whyChooseUs: p.whyChooseUs.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
  }))

  const toggleFeaturedCategory = (id) => {
    setData((p) => ({
      ...p,
      featuredCategories: p.featuredCategories.includes(id)
        ? p.featuredCategories.filter((c) => c !== id)
        : [...p.featuredCategories, id],
    }))
  }

  const toggleFeaturedProduct = (id) => {
    setData((p) => ({
      ...p,
      featuredProducts: p.featuredProducts.includes(id)
        ? p.featuredProducts.filter((pid) => pid !== id)
        : [...p.featuredProducts, id],
    }))
  }

  const addTestimonial = () => setData((p) => ({
    ...p, testimonials: [...p.testimonials, { name: '', role: '', quote: '', rating: 5 }]
  }))
  const removeTestimonial = (i) => setData((p) => ({ ...p, testimonials: p.testimonials.filter((_, idx) => idx !== i) }))
  const updateTestimonial = (i, field, value) => setData((p) => ({
    ...p, testimonials: p.testimonials.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
  }))

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'why', label: 'Why Choose Us' },
    { id: 'categories', label: 'Featured Categories' },
    { id: 'products', label: 'Featured Products' },
    { id: 'testimonials', label: 'Testimonials' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Homepage Editor</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage all sections of the homepage</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id ? 'bg-green-700 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800 text-lg">Hero Section</h2>
            <ImageUploader
              label="Hero Background Image"
              currentImage={data.hero?.image}
              onUpload={(url) => updateHero('image', url)}
            />
            <div>
              <label className="label">Headline</label>
              <input value={data.hero?.title || ''} onChange={(e) => updateHero('title', e.target.value)} placeholder="Farm Fresh Straight to Your Door" className="input-field" />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <textarea value={data.hero?.subtitle || ''} onChange={(e) => updateHero('subtitle', e.target.value)} rows={2} placeholder="Hero subtitle text" className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Primary CTA Text</label>
                <input value={data.hero?.ctaText || ''} onChange={(e) => updateHero('ctaText', e.target.value)} placeholder="Shop Now" className="input-field" />
              </div>
              <div>
                <label className="label">Primary CTA Link</label>
                <input value={data.hero?.ctaLink || ''} onChange={(e) => updateHero('ctaLink', e.target.value)} placeholder="/products" className="input-field" />
              </div>
              <div>
                <label className="label">Secondary CTA Text</label>
                <input value={data.hero?.secondaryCtaText || ''} onChange={(e) => updateHero('secondaryCtaText', e.target.value)} placeholder="Request Quote" className="input-field" />
              </div>
              <div>
                <label className="label">Secondary CTA Link</label>
                <input value={data.hero?.secondaryCtaLink || ''} onChange={(e) => updateHero('secondaryCtaLink', e.target.value)} placeholder="/enquiry" className="input-field" />
              </div>
            </div>
          </div>
        )}

        {/* Why Choose Us */}
        {activeTab === 'why' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-lg">Why Choose Us</h2>
              <button onClick={addWhyItem} className="flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-semibold">
                <FiPlus className="w-4 h-4" /> Add Item
              </button>
            </div>
            {(data.whyChooseUs || []).map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-600">Item #{i + 1}</span>
                  <button onClick={() => removeWhyItem(i)} className="text-red-400 hover:text-red-600">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Icon</label>
                    <select value={item.icon} onChange={(e) => updateWhyItem(i, 'icon', e.target.value)} className="input-field">
                      {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Title</label>
                    <input value={item.title} onChange={(e) => updateWhyItem(i, 'title', e.target.value)} placeholder="e.g. Farm Fresh" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea value={item.description} onChange={(e) => updateWhyItem(i, 'description', e.target.value)} rows={2} className="input-field resize-none" placeholder="Brief description" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 text-lg">Featured Categories</h2>
            <p className="text-gray-500 text-sm">Select categories to feature on the homepage.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <label key={cat._id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  (data.featuredCategories || []).includes(cat._id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="checkbox" checked={(data.featuredCategories || []).includes(cat._id)} onChange={() => toggleFeaturedCategory(cat._id)} className="accent-green-600" />
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Featured Products */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 text-lg">Featured Products</h2>
            <p className="text-gray-500 text-sm">Select up to 6 products to feature on the homepage.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((prod) => (
                <label key={prod._id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  (data.featuredProducts || []).includes(prod._id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="checkbox" checked={(data.featuredProducts || []).includes(prod._id)} onChange={() => toggleFeaturedProduct(prod._id)} className="accent-green-600" />
                  <span className="text-sm font-medium text-gray-700 truncate">{prod.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {activeTab === 'testimonials' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-lg">Testimonials</h2>
              <button onClick={addTestimonial} className="flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-semibold">
                <FiPlus className="w-4 h-4" /> Add Testimonial
              </button>
            </div>
            {(data.testimonials || []).map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-600">Testimonial #{i + 1}</span>
                  <button onClick={() => removeTestimonial(i)} className="text-red-400 hover:text-red-600">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Name</label>
                    <input value={t.name} onChange={(e) => updateTestimonial(i, 'name', e.target.value)} placeholder="Customer Name" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Role / Company</label>
                    <input value={t.role} onChange={(e) => updateTestimonial(i, 'role', e.target.value)} placeholder="CEO, Company" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label">Quote</label>
                  <textarea value={t.quote} onChange={(e) => updateTestimonial(i, 'quote', e.target.value)} rows={2} placeholder="What the customer said..." className="input-field resize-none" />
                </div>
                <div>
                  <label className="label">Rating (1-5)</label>
                  <input type="number" value={t.rating} onChange={(e) => updateTestimonial(i, 'rating', Math.min(5, Math.max(1, Number(e.target.value))))} min={1} max={5} className="input-field w-24" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminHomepagePage
