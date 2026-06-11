import api from './axiosInstance'

export const getCMSPage = (slug) => api.get(`/cms/${slug}`)
export const updateCMSPage = (slug, data) => api.put(`/cms/${slug}`, data)
export const getAllCMSPages = () => api.get('/cms')
