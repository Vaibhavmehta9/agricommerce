export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)

export const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.jpg'
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000'}${path}`
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export const truncate = (str, length = 100) => {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}
