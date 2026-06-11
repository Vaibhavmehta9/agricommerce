import React from 'react'
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
      </td>
    </tr>
  )
}

function AdminTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'No records found',
  emptyIcon,
  actions,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete || actions) && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
          </table>
        </div>
        <div className="py-16 text-center">
          {emptyIcon && <div className="flex justify-center mb-3 text-gray-300">{emptyIcon}</div>}
          <p className="text-gray-500 text-sm font-medium">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || actions) && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700 max-w-[200px]">
                    {col.render ? col.render(row[col.key], row) : (
                      <span className="truncate block">{row[col.key] ?? '—'}</span>
                    )}
                  </td>
                ))}
                {(onEdit || onDelete || actions) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {actions && actions(row)}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                          title="Edit"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                          title="Delete"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTable
