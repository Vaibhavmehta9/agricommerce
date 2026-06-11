// Email validation
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Phone validation (Indian format)
export const isValidPhone = (phone) => {
  const regex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
  const cleaned = phone.replace(/[\s\-]/g, '')
  return /^[6-9]\d{9}$/.test(cleaned) || regex.test(cleaned)
}

// Required field checker
export const isRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

// Validate min length
export const minLength = (value, min) => {
  return String(value).trim().length >= min
}

// Validate max length
export const maxLength = (value, max) => {
  return String(value).trim().length <= max
}

// Validate positive number
export const isPositiveNumber = (value) => {
  return !isNaN(value) && Number(value) > 0
}

// Validate a URL
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Run multiple validators and return first error message
export const validate = (value, rules) => {
  for (const rule of rules) {
    const error = rule(value)
    if (error) return error
  }
  return null
}

// Common rule creators
export const rules = {
  required: (msg = 'This field is required') =>
    (value) => !isRequired(value) ? msg : null,
  email: (msg = 'Enter a valid email address') =>
    (value) => value && !isValidEmail(value) ? msg : null,
  phone: (msg = 'Enter a valid phone number') =>
    (value) => value && !isValidPhone(value) ? msg : null,
  min: (len, msg) =>
    (value) => value && !minLength(value, len) ? msg || `Minimum ${len} characters required` : null,
  max: (len, msg) =>
    (value) => value && !maxLength(value, len) ? msg || `Maximum ${len} characters allowed` : null,
  positive: (msg = 'Enter a positive number') =>
    (value) => value && !isPositiveNumber(value) ? msg : null,
}
