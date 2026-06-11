import React, { useState, useRef } from 'react'
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { uploadImage, uploadImages } from '../../api/uploadAPI'
import { getImageUrl } from '../../utils/formatPrice'

function ImageUploader({ onUpload, currentImage, currentImages = [], multiple = false, label = 'Image' }) {
  const [loading, setLoading] = useState(false)
  const [previews, setPreviews] = useState(
    multiple
      ? (currentImages.length > 0 ? currentImages : [])
      : (currentImage ? [currentImage] : [])
  )
  const inputRef = useRef(null)

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setLoading(true)
    try {
      if (multiple) {
        const formData = new FormData()
        files.forEach((file) => formData.append('images', file))
        const response = await uploadImages(formData)
        const urls = response.data.urls || response.data.data || []
        const newPreviews = [...previews, ...urls]
        setPreviews(newPreviews)
        onUpload(newPreviews)
        toast.success(`${urls.length} image(s) uploaded`)
      } else {
        const formData = new FormData()
        formData.append('image', files[0])
        const response = await uploadImage(formData)
        const url = response.data.url || response.data.data?.url || response.data.path
        setPreviews([url])
        onUpload(url)
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload image'
      toast.error(msg)
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (index) => {
    if (multiple) {
      const updated = previews.filter((_, i) => i !== index)
      setPreviews(updated)
      onUpload(updated)
    } else {
      setPreviews([])
      onUpload(null)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      {/* Upload button */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          loading
            ? 'border-green-300 bg-green-50 cursor-wait'
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50 bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <FiLoader className="w-8 h-8 text-green-500 animate-spin" />
            <p className="text-green-600 text-sm font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
              <FiUpload className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Click to upload {multiple ? 'images' : 'an image'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Image previews */}
      {previews.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2'}`}>
          {previews.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
              <img
                src={getImageUrl(url)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200?text=Image'
                }}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                title="Remove image"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
