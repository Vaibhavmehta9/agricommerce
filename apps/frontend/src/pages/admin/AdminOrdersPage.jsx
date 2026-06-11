import React, { useState, useEffect } from 'react'
import { FiShoppingBag, FiX, FiFilter } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import { getOrders, updateOrderStatus } from '../../api/ordersAPI'
import { formatPrice, formatDateTime, getImageUrl } from '../../utils/formatPrice'

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { limit: 100 }
      if (filterStatus) params.status = filterStatus
      const res = await getOrders(params)
      const d = res.data?.data || res.data || []
      setOrders(Array.isArray(d) ? d : d.orders || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [filterStatus])

  const handleStatusChange = async (order, status) => {
    setUpdatingId(order._id)
    try {
      await updateOrderStatus(order._id, status)
      toast.success(`Order status updated to "${status}"`)
      fetchData()
    } catch {
      toast.error('Failed to update order status')
    } finally { setUpdatingId(null) }
  }

  const columns = [
    { key: 'customer', label: 'Customer', render: (c) => <span className="font-medium">{c?.name || '—'}</span> },
    { key: 'customer', label: 'Email', render: (c) => <span className="text-gray-500 text-xs">{c?.email || '—'}</span> },
    {
      key: 'items', label: 'Items',
      render: (items) => <span>{items?.length || 0} item(s)</span>,
    },
    {
      key: 'total', label: 'Total',
      render: (total) => <span className="font-semibold text-green-700">{formatPrice(total)}</span>,
    },
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
          <h1 className="text-2xl font-black text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} orders</p>
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
        data={orders}
        isLoading={loading}
        emptyMessage="No orders yet"
        emptyIcon={<FiShoppingBag className="w-12 h-12" />}
        actions={(row) => (
          <button
            onClick={() => setSelectedOrder(row)}
            className="text-green-600 hover:text-green-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
          >
            View
          </button>
        )}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Customer info */}
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Customer</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Name', value: selectedOrder.customer?.name },
                    { label: 'Email', value: selectedOrder.customer?.email },
                    { label: 'Phone', value: selectedOrder.customer?.phone },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="text-gray-500 text-sm w-16 flex-shrink-0">{label}:</span>
                      <span className="text-gray-800 text-sm font-medium">{value || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              {selectedOrder.address && (
                <div>
                  <h3 className="font-bold text-gray-700 text-sm mb-2 uppercase tracking-wide">Delivery Address</h3>
                  <p className="text-gray-600 text-sm bg-gray-50 rounded-xl p-3">
                    {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state} — {selectedOrder.address.pincode}
                  </p>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Items</h3>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name || item.product?.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-700">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total + Status */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-black text-green-700">{formatPrice(selectedOrder.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={async (e) => {
                      await handleStatusChange(selectedOrder, e.target.value)
                      setSelectedOrder({ ...selectedOrder, status: e.target.value })
                    }}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer ${STATUS_COLORS[selectedOrder.status] || 'bg-gray-100'}`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notes:</p>
                  <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-3">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage
