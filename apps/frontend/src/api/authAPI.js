import api from './axiosInstance'

export const loginAdmin = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')
export const changePassword = (data) => api.put('/auth/change-password', data)
