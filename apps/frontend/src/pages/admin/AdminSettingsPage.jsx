import React, { useState, useEffect } from 'react'
import { FiSave, FiLoader, FiGlobe, FiPhone, FiShare2, FiBriefcase, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getSettings, updateSettings } from '../../api/settingsAPI'
import ImageUploader from '../../components/admin/ImageUploader'

const initialSettings = {
  siteName: '',
  logo: '',
  defaultMode: 'b2c',
  email: '',
  phone: '',
  address: '',
  whatsapp: '',
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  youtube: '',
  gstNumber: '',
  registration: '',
  bankDetails: '',
  metaTitle: '',
  metaDescription: '',
}

const TABS = [
  { id: 'general', label: 'General', icon: FiGlobe },
  { id: 'contact', label: 'Contact Info', icon: FiPhone },
  { id: 'social', label: 'Social Links', icon: FiShare2 },
  { id: 'business', label: 'Business', icon: FiBriefcase },
  { id: 'seo', label: 'SEO Defaults', icon: FiSearch },
]

function AdminSettingsPage() {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      try {
        const res = await getSettings()
        const d = res.data?.data || res.data
        if (d) setSettings({ ...initialSettings, ...d })
      } catch {}
      finally { setLoading(false) }
    }
    fetchSettings()
  }, [])

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings(settings)
      toast.success('Settings saved successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings')
    } finally { setSaving(false) }
  }

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
          <h1 className="text-2xl font-black text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your store settings</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === id ? 'bg-green-700 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* General */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800 text-lg">General Settings</h2>
            <ImageUploader label="Site Logo" currentImage={settings.logo} onUpload={(url) => handleChange('logo', url)} />
            <div>
              <label className="label">Site Name</label>
              <input value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} placeholder="AgriCommerce" className="input-field" />
            </div>
            <div>
              <label className="label">Default Shopping Mode</label>
              <select value={settings.defaultMode} onChange={(e) => handleChange('defaultMode', e.target.value)} className="input-field">
                <option value="b2c">B2C (Retail)</option>
                <option value="b2b">B2B (Wholesale)</option>
              </select>
            </div>
          </div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800 text-lg">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'email', label: 'Email Address', placeholder: 'hello@agricommerce.in', type: 'email' },
                { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', type: 'tel' },
                { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+91 98765 43210', type: 'tel' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input type={type} value={settings[key]} onChange={(e) => handleChange(key, e.target.value)} placeholder={placeholder} className="input-field" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="label">Address</label>
                <textarea value={settings.address} onChange={(e) => handleChange('address', e.target.value)} rows={3} placeholder="Full business address" className="input-field resize-none" />
              </div>
            </div>
          </div>
        )}

        {/* Social */}
        {activeTab === 'social' && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800 text-lg">Social Media Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'facebook', label: 'Facebook URL' },
                { key: 'instagram', label: 'Instagram URL' },
                { key: 'twitter', label: 'Twitter/X URL' },
                { key: 'linkedin', label: 'LinkedIn URL' },
                { key: 'youtube', label: 'YouTube URL' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input value={settings[key]} onChange={(e) => handleChange(key, e.target.value)} placeholder={`https://www.${key}.com/agricommerce`} className="input-field" type="url" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business */}
        {activeTab === 'business' && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800 text-lg">Business Details</h2>
            <div>
              <label className="label">GST Number</label>
              <input value={settings.gstNumber} onChange={(e) => handleChange('gstNumber', e.target.value)} placeholder="22AAAAA0000A1Z5" className="input-field font-mono" />
            </div>
            <div>
              <label className="label">Business Registration Number</label>
              <input value={settings.registration} onChange={(e) => handleChange('registration', e.target.value)} placeholder="CIN/Company Registration Number" className="input-field" />
            </div>
            <div>
              <label className="label">Bank Details (for invoicing)</label>
              <textarea value={settings.bankDetails} onChange={(e) => handleChange('bankDetails', e.target.value)} rows={4} placeholder="Bank Name, Account Number, IFSC, Branch" className="input-field resize-none font-mono text-sm" />
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800 text-lg">Default SEO Settings</h2>
            <div>
              <label className="label">Default Meta Title</label>
              <input value={settings.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} placeholder="AgriCommerce - Farm Fresh Marketplace" className="input-field" maxLength={70} />
              <p className="text-xs text-gray-400 mt-1">{settings.metaTitle?.length || 0}/70 characters</p>
            </div>
            <div>
              <label className="label">Default Meta Description</label>
              <textarea value={settings.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} rows={3} placeholder="Your trusted farm-fresh marketplace..." className="input-field resize-none" maxLength={160} />
              <p className="text-xs text-gray-400 mt-1">{settings.metaDescription?.length || 0}/160 characters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminSettingsPage
