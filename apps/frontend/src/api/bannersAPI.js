import api from './axiosInstance'

export const getBanners = (params = {}) => api.get('/banners', { params })
export const getBannerById = (id) => api.get(`/banners/${id}`)
export const createBanner = (data) => api.post('/banners', data)
export const updateBanner = (id, data) => api.put(`/banners/${id}`, data)
export const deleteBanner = (id) => api.delete(`/banners/${id}`)
