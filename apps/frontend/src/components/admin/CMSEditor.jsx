import React from 'react'
import { FiFileText } from 'react-icons/fi'

function CMSEditor({ value = '', onChange, label = 'Content', placeholder = 'Enter HTML content here...', rows = 20 }) {
  const charCount = value ? value.length : 0
  const wordCount = value ? value.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FiFileText className="w-4 h-4 text-green-600" />
          {label}
        </label>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all">
        {/* Toolbar hint */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">HTML Editor</span>
          <span className="text-xs text-gray-400">— Supports full HTML markup</span>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          className="w-full px-4 py-3 font-mono text-sm text-gray-800 bg-white resize-y focus:outline-none leading-relaxed"
        />
      </div>

      {/* Preview hint */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        HTML is rendered directly on the customer-facing page
      </div>
    </div>
  )
}

export default CMSEditor
