import React, { useState } from 'react'
import { FiUser, FiBriefcase, FiPhone, FiMail, FiPackage, FiHash, FiMessageSquare, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { submitEnquiry } from '../../api/enquiriesAPI'
import { isValidEmail, isValidPhone, isRequired } from '../../utils/validators'

const initialForm = {
  companyName: '',
  contactPerson: '',
  phone: '',
  email: '',
  productName: '',
  quantity: '',
  message: '',
}

function EnquiryForm({ initialProductName = '', onSuccess }) {
  const [form, setForm] = useState({ ...initialForm, productName: initialProductName })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!isRequired(form.companyName)) newErrors.companyName = 'Company name is required'
    if (!isRequired(form.contactPerson)) newErrors.contactPerson = 'Contact person name is required'
    if (!isRequired(form.phone)) {
      newErrors.phone = 'Phone number is required'
    } else if (!isValidPhone(form.phone)) {
      newErrors.phone = 'Enter a valid phone number'
    }
    if (!isRequired(form.email)) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!isRequired(form.productName)) newErrors.productName = 'Product name is required'
    if (!isRequired(form.quantity)) newErrors.quantity = 'Quantity is required'
    if (!isRequired(form.message)) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await submitEnquiry(form)
      setSubmitted(true)
      setForm(initialForm)
      toast.success('Enquiry submitted successfully! We will contact you shortly.')
      if (onSuccess) onSuccess()
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit enquiry. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Enquiry Submitted!</h3>
        <p className="text-green-600 mb-4">
          Thank you for your interest. Our team will reach out to you within 24-48 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-green-700 underline hover:text-green-900 text-sm"
        >
          Submit another enquiry
        </button>
      </div>
    )
  }

  const fields = [
    { name: 'companyName', label: 'Company Name', icon: FiBriefcase, placeholder: 'Your company name', type: 'text', required: true },
    { name: 'contactPerson', label: 'Contact Person', icon: FiUser, placeholder: 'Full name', type: 'text', required: true },
    { name: 'phone', label: 'Phone Number', icon: FiPhone, placeholder: '+91 98765 43210', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', icon: FiMail, placeholder: 'you@company.com', type: 'email', required: true },
    { name: 'productName', label: 'Product Name', icon: FiPackage, placeholder: 'Product you are interested in', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity Required', icon: FiHash, placeholder: 'e.g. 500 kg, 100 units', type: 'text', required: true },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map(({ name, label, icon: Icon, placeholder, type, required }) => (
          <div key={name}>
            <label className="label">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`input-field pl-10 ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
            </div>
            {errors[name] && (
              <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Message field */}
      <div>
        <label className="label">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FiMessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your requirements, delivery location, preferred payment terms..."
            rows={4}
            className={`input-field pl-10 resize-none ${errors.message ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </div>
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-base"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <FiSend className="w-4 h-4" />
            Submit Enquiry
          </>
        )}
      </button>
    </form>
  )
}

export default EnquiryForm
