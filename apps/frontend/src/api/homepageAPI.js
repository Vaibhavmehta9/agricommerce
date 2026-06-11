import api from './axiosInstance'

export const getHomepage = () => api.get('/homepage')
export const updateHomepage = (data) => api.put('/homepage', data)
