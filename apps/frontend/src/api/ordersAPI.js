import api from './axiosInstance'

export const placeOrder = (data) => api.post('/orders', data)
export const getOrders = (params = {}) => api.get('/orders', { params })
export const getOrderById = (id) => api.get(`/orders/${id}`)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`)
