import React from 'react'
import { Link } from 'react-router-dom'
import { FiSend, FiTruck, FiDollarSign, FiUsers, FiArrowRight } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import EnquiryForm from '../../components/common/EnquiryForm'
import { useMode } from '../../context/ModeContext'
import { useLocation } from 'react-router-dom'

const b2bBenefits = [
  {
    icon: FiTruck,
    title: 'Bulk Delivery',
    description: 'Dedicated logistics for large volume orders with priority scheduling.',
  },
  {
    icon: FiDollarSign,
    title: 'Wholesale Pricing',
    description: 'Exclusive bulk pricing up to 40% below retail rates for registered businesses.',
  },
  {
    icon: FiUsers,
    title: 'Dedicated Account Manager',
    description: 'Get a personal account manager for seamless order management.',
  },
  {
    icon: FiSend,
    title: 'Custom Supply Contracts',
    description: 'Tailor supply agreements to your business needs with flexible terms.',
  },
]

function EnquiryPage() {
  const { isB2B } = useMode()
  const location = useLocation()
  const initialProductName = location.state?.productName || ''

  // Redirect B2C users to products
  if (!isB2B) {
    return (
      <PageWrapper title="Wholesale Enquiry">
        <CustomerLayout>
          <div className="max-w-xl mx-auto text-center py-24 px-4">
            <div className="text-6xl mb-6">🌿</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">You're in Retail Mode</h1>
            <p className="text-gray-500 mb-6">
              Switch to Wholesale mode to access bulk enquiry. Or browse our products to shop directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Browse Products <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </CustomerLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Bulk Enquiry" description="Request wholesale quotes for agricultural products. Competitive bulk pricing for businesses.">
      <CustomerLayout>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-green-800 to-green-900 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-white rounded-full" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-1.5 mb-5 text-amber-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Wholesale Enquiry
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Scale Your Business with<br />
              <span className="text-amber-400">Bulk Agricultural Supply</span>
            </h1>
            <p className="text-green-200 text-lg max-w-2xl mx-auto">
              Connect with our wholesale team for competitive bulk pricing, custom supply agreements, and dedicated logistics support.
            </p>
          </div>
        </div>

        {/* B2B Benefits */}
        <section className="py-14 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Why Buy Wholesale from Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {b2bBenefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enquiry Form */}
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit Your Enquiry</h2>
                <p className="text-gray-500 text-sm">
                  Fill in the form below and our wholesale team will get back to you within 24-48 hours.
                </p>
              </div>
              <EnquiryForm initialProductName={initialProductName} />
            </div>
          </div>
        </section>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default EnquiryPage
