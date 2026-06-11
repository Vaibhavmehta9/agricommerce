import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ErrorBoundary from '../common/ErrorBoundary'

function CustomerLayout({ children }) {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default CustomerLayout
