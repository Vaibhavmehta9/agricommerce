import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiHome } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'

function NotFoundPage() {
  return (
    <PageWrapper title="404 - Page Not Found">
      <CustomerLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* 404 visual */}
            <div className="relative mb-8">
              <div className="text-[120px] sm:text-[160px] font-black text-green-100 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🌿</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-3">
              Page Not Found
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have gone missing. It may have been moved, deleted, or perhaps the URL was mistyped.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <FiHome className="w-4 h-4" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default NotFoundPage
