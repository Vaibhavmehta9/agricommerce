import api from './axiosInstance'

export const submitEnquiry = (data) => api.post('/enquiries', data)
export const getEnquiries = (params = {}) => api.get('/enquiries', { params })
export const getEnquiryById = (id) => api.get(`/enquiries/${id}`)
export const updateEnquiryStatus = (id, status) => api.put(`/enquiries/${id}/status`, { status })
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`)
