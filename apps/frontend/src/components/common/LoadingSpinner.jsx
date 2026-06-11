import React from 'react'

const sizeMap = {
  sm: 'w-5 h-5 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-16 h-16 border-4',
}

function LoadingSpinner({ size = 'md', fullScreen = false, message = '' }) {
  const spinnerClass = sizeMap[size] || sizeMap.md

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${spinnerClass} border-green-200 border-t-green-600 rounded-full animate-spin`}
      />
      {message && (
        <p className="text-gray-500 text-sm font-medium animate-pulse">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}

export default LoadingSpinner
