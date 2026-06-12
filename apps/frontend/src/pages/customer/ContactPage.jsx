import React, { useState, useEffect } from 'react'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'
import toast from 'react-hot-toast'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import Breadcrumb from '../../components/common/Breadcrumb'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getCMSPage } from '../../api/cmsAPI'
import { submitEnquiry } from '../../api/enquiriesAPI'
import { isValidEmail, isValidPhone, isRequired } from '../../utils/validators'

function ContactPage() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await getCMSPage('contact')
        setPage(res.data?.page || res.data?.data || res.data)
      } catch (err) {
        // Fallback info if CMS page doesn't exist in DB yet
        setPage({
          title: 'Contact Us',
          body: '<p>Have questions about our fresh farm produce or wholesale terms? Get in touch with us today. Our representative will get back to you shortly.</p>',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [])

  const validate = () => {
    const errs = {}
    if (!isRequired(form.name)) errs.name = 'Name is required'
    if (!isRequired(form.email)) {
      errs.email = 'Email is required'
    } else if (!isValidEmail(form.email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!isRequired(form.phone)) {
      errs.phone = 'Phone number is required'
    } else if (!isValidPhone(form.phone)) {
      errs.phone = 'Enter a valid phone number'
    }
    if (!isRequired(form.message)) errs.message = 'Message is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitLoading(true)
    try {
      const payload = {
        companyName: 'General Inquiry',
        contactPerson: form.name,
        phone: form.phone,
        email: form.email,
        productName: 'General Inquiry',
        quantity: 'N/A',
        message: form.message,
      }
      await submitEnquiry(payload)
      toast.success('Your message has been sent successfully!')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <PageWrapper title={page?.title || 'Contact Us'}>
      <CustomerLayout>
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: page?.title || 'Contact Us' }]} />
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-4">{page?.title || 'Contact Us'}</h1>
          </div>
        </div>

        {/* Content grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <LoadingSpinner message="Loading page..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Info Card */}
              <div className="lg:col-span-5 space-y-6">
                {/* Introduction from CMS */}
                <div
                  className="prose prose-sm text-gray-600 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: page?.body || '' }}
                />

                {/* Contact detail cards */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 flex-shrink-0">
                      <FiMapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Office Address</h4>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        123 Agri Lane, Farmville, Sector 4,<br />
                        Pune, Maharashtra, India — 411001
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 flex-shrink-0">
                      <FiPhone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Phone Number</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        General: <a href="tel:+919876543210" className="hover:underline font-semibold text-green-700">+91 98765 43210</a>
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        Support: <a href="tel:+919876543211" className="hover:underline font-semibold text-green-700">+91 98765 43211</a>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 flex-shrink-0">
                      <FiMail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Email Address</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        Sales: <a href="mailto:sales@agricommerce.com" className="hover:underline font-semibold text-green-700">sales@agricommerce.com</a>
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        Inquiries: <a href="mailto:info@agricommerce.com" className="hover:underline font-semibold text-green-700">info@agricommerce.com</a>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 flex-shrink-0">
                      <FiClock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Business Hours</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        Monday – Saturday: 9:00 AM – 6:00 PM
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <h3 className="text-2xl font-black text-gray-800 mb-1">Send a Message</h3>
                  <p className="text-gray-500 text-sm mb-6">Fill out the form below and we will contact you shortly.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="label">Your Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`input-field pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                          required
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Email Address *</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                            required
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="label">Phone Number *</label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className={`input-field pl-10 ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                            required
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="label">Message *</label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          rows={5}
                          className={`input-field pl-10 resize-none ${errors.message ? 'border-red-400 focus:ring-red-400' : ''}`}
                          required
                        />
                      </div>
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 text-base mt-2"
                    >
                      {submitLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiSend className="w-4 h-4" />
                      )}
                      {submitLoading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default ContactPage
