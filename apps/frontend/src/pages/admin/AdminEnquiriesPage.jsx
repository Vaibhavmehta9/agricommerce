import React, { useState, useEffect } from 'react'
import { FiMessageSquare, FiX, FiFilter } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import { getEnquiries, updateEnquiryStatus } from '../../api/enquiriesAPI'
import { formatDateTime } from '../../utils/formatPrice'

const STATUS_OPTIONS = ['New', 'In Progress', 'Resolved']
const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
}

function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { limit: 100 }
      if (filterStatus) params.status = filterStatus
      const res = await getEnquiries(params)
      const d = res.data?.data || res.data || []
      setEnquiries(Array.isArray(d) ? d : d.enquiries || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [filterStatus])

  const handleStatusChange = async (enquiry, status) => {
    setUpdatingId(enquiry._id)
    try {
      await updateEnquiryStatus(enquiry._id, status)
      toast.success(`Status updated to "${status}"`)
      fetchData()
    } catch {
      toast.error('Failed to update status')
    } finally { setUpdatingId(null) }
  }

  const columns = [
    { key: 'companyName', label: 'Company' },
    { key: 'contactPerson', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'productName', label: 'Product' },
    { key: 'quantity', label: 'Quantity' },
    {
      key: 'status', label: 'Status',
      render: (status, row) => (
        <select
          value={status}
          disabled={updatingId === row._id}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-green-500 outline-none ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
    {
      key: 'createdAt', label: 'Date',
      render: (date) => <span className="text-gray-500 text-xs">{formatDateTime(date)}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Enquiries</h1>
          <p className="text-gray-500 text-sm mt-0.5">{enquiries.length} enquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-auto py-2 text-sm"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={enquiries}
        isLoading={loading}
        emptyMessage="No enquiries yet"
        emptyIcon={<FiMessageSquare className="w-12 h-12" />}
        actions={(row) => (
          <button
            onClick={() => setSelectedEnquiry(row)}
            className="text-green-600 hover:text-green-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
          >
            View
          </button>
        )}
      />

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Enquiry Details</h2>
              <button onClick={() => setSelectedEnquiry(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {[
                  { label: 'Company', value: selectedEnquiry.companyName },
                  { label: 'Contact Person', value: selectedEnquiry.contactPerson },
                  { label: 'Email', value: selectedEnquiry.email },
                  { label: 'Phone', value: selectedEnquiry.phone },
                  { label: 'Product', value: selectedEnquiry.productName },
                  { label: 'Quantity', value: selectedEnquiry.quantity },
                  { label: 'Date', value: formatDateTime(selectedEnquiry.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-gray-500 text-sm w-32 flex-shrink-0 font-medium">{label}:</span>
                    <span className="text-gray-800 text-sm font-semibold">{value || '—'}</span>
                  </div>
                ))}

                {selectedEnquiry.message && (
                  <div>
                    <span className="text-gray-500 text-sm font-medium block mb-1">Message:</span>
                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                      {selectedEnquiry.message}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-gray-500 text-sm font-medium">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={async (e) => {
                      await handleStatusChange(selectedEnquiry, e.target.value)
                      setSelectedEnquiry({ ...selectedEnquiry, status: e.target.value })
                    }}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer ${STATUS_COLORS[selectedEnquiry.status] || 'bg-gray-100'}`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEnquiriesPage
