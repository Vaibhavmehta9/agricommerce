import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiAlertCircle } from 'react-icons/fi'
import CustomerLayout from '../../components/layout/CustomerLayout'
import PageWrapper from '../../components/common/PageWrapper'
import Breadcrumb from '../../components/common/Breadcrumb'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getCMSPage } from '../../api/cmsAPI'

function CMSPageView() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getCMSPage(slug)
        setPage(res.data?.data || res.data)
      } catch (err) {
        setError(err.response?.status === 404 ? 'Page not found' : 'Failed to load page')
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [slug])

  if (loading) {
    return (
      <PageWrapper title="Loading...">
        <CustomerLayout>
          <LoadingSpinner size="lg" />
        </CustomerLayout>
      </PageWrapper>
    )
  }

  if (error || !page) {
    return (
      <PageWrapper title="Page Not Found">
        <CustomerLayout>
          <div className="max-w-xl mx-auto text-center py-24 px-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiAlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{error || 'Page Not Found'}</h1>
            <p className="text-gray-500 mb-6">
              The page you're looking for doesn't exist or hasn't been published yet.
            </p>
            <Link to="/" className="btn-primary">Go to Homepage</Link>
          </div>
        </CustomerLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title={page.title}>
      <CustomerLayout>
        {/* Page hero header */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: page.title }]} />
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-4">{page.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-800 prose-headings:font-bold
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-800
              prose-ul:text-gray-600 prose-ol:text-gray-600
              prose-li:leading-relaxed
              prose-img:rounded-xl prose-img:shadow-md
              prose-hr:border-gray-200
              prose-blockquote:border-green-500 prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: page.body || page.content || '<p>No content available yet.</p>' }}
          />
        </div>
      </CustomerLayout>
    </PageWrapper>
  )
}

export default CMSPageView
