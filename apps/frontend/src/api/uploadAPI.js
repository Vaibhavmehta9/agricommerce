import api from './axiosInstance'

export const uploadImage = (formData) =>
  api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const uploadImages = (formData) =>
  api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
