import React, { useEffect } from 'react'

function PageWrapper({ title, description, children, className = '' }) {
  useEffect(() => {
    const base = 'AgriCommerce'
    document.title = title ? `${title} | ${base}` : base
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', description)
      }
    }
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [title, description])

  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  )
}

export default PageWrapper
