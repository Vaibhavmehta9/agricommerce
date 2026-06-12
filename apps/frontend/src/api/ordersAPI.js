import api from './axiosInstance'

export const placeOrder = (data) => api.post('/orders', data)
export const getOrders = (params = {}) => api.get('/orders', { params })
export const getMyOrders = () => api.get('/orders/my-orders')
export const getOrderById = (id) => api.get(`/orders/${id}`)
export const trackOrder = (orderId, email) => api.get('/orders/track', { params: { orderId, email } })
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })
export const cancelOrder = (id, email = null) => api.put(`/orders/${id}/cancel`, email ? { email } : {})
export const returnOrder = (id, email = null) => api.put(`/orders/${id}/return`, email ? { email } : {})
