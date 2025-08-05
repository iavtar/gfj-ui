import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import OrderDetailsModal from './OrderDetailsModal';
import ShippingStats from './ShippingStats';
import { shippingApi } from '../../../app/shippingApi';

// Add CSS to ensure text visibility
const tableStyles = `
  .shipping-table * {
    color: #111827 !important;
  }
  .shipping-table th {
    color: #6B7280 !important;
  }
  .shipping-table td {
    color: #111827 !important;
  }
  .shipping-table .text-gray-500 {
    color: #6B7280 !important;
  }
  .shipping-table .text-gray-400 {
    color: #9CA3AF !important;
  }
  .shipping-table .text-gray-900 {
    color: #111827 !important;
  }
`;

// Inject styles
if (!document.getElementById('shipping-table-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'shipping-table-styles';
  styleSheet.textContent = tableStyles;
  document.head.appendChild(styleSheet);
}

const ShippingTracker = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newOrder, setNewOrder] = useState({
    orderId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    items: '',
    status: 'pending',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: '',
    quotationId: ''
  });

  // Function to transform API data to match component structure
  const transformShippingData = (apiData) => {
    return apiData.map(item => ({
      id: item.id,
      orderId: item.shippingId,
      customerName: item.clientDetails?.clientName || 'N/A',
      customerEmail: item.clientDetails?.email || 'N/A',
      customerPhone: item.clientDetails?.phoneNumber || 'N/A',
      shippingAddress: item.clientDetails?.shippingAddress || 'N/A',
      items: item.quotationDetails?.description || 'N/A',
      status: item.status?.toLowerCase() || 'pending',
      trackingNumber: item.trackingId || '',
      estimatedDelivery: item.estimatedDelivery || '',
      notes: item.notes || '',
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A',
      // Store original data for API calls
      originalData: item
    }));
  };

  // Load shipping data from API
  const loadShippingData = async () => {
    try {
      setLoading(true);
      const response = await shippingApi.getAllShippingItems();
      const transformedData = transformShippingData(response);
      setOrders(transformedData);
    } catch (error) {
      console.error('Error loading shipping data:', error);
      toast.error('Failed to load shipping data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShippingData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddOrder = async () => {
    if (!newOrder.quotationId || !newOrder.trackingNumber) {
      toast.error('Quotation ID and Tracking ID are required');
      return;
    }

    try {
      setLoading(true);
      const shippingData = {
        quotationId: newOrder.quotationId,
        trackingId: newOrder.trackingNumber
      };

      await shippingApi.createShippingItem(shippingData);
      
      // Reload data after successful creation
      await loadShippingData();
      
      setNewOrder({
        orderId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        items: '',
        status: 'pending',
        trackingNumber: '',
        estimatedDelivery: '',
        notes: '',
        quotationId: ''
      });
      setShowAddOrder(false);
      toast.success('Shipping item added successfully');
    } catch (error) {
      console.error('Error adding shipping item:', error);
      toast.error('Failed to add shipping item');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await shippingApi.updateShippingStatus(orderId, newStatus.toUpperCase());
      
      // Reload data after successful update
      await loadShippingData();
      
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        setLoading(true);
        await shippingApi.deleteShippingItem(orderId);
        
        // Reload data after successful deletion
        await loadShippingData();
        
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50" style={{ color: '#111827' }}>
      {/* Sticky Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-2xl text-white">📦</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Shipping Tracker
                </h1>
                <p className="text-gray-600 mt-1">Track and manage all your orders efficiently</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadShippingData}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span className="text-lg">🔄</span>
              <span>Refresh</span>
            </button>
                         <button
               onClick={() => setShowAddOrder(true)}
               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
             >
               <span className="text-lg">📦</span>
               <span>Add Shipping Item</span>
             </button>
          </div>
        </div>

        {/* Statistics */}
        <ShippingStats orders={orders} />

        {/* Search and Filter */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
                          <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Tracking Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 !text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
              style={{ color: '#111827' }}
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
                          <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 !text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
              style={{ color: '#111827' }}
            >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
                          <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Clear Filters
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 min-h-0">
        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-full shipping-table" style={{ color: '#111827' }}>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading shipping data...</span>
            </div>
          )}
          <div className="overflow-x-auto h-full">
            <table className="min-w-full divide-y divide-gray-200" style={{ color: '#111827' }}>
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 !text-gray-500 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 !text-gray-500 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 !text-gray-500 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 !text-gray-500 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 !text-gray-500 uppercase tracking-wider" style={{ color: '#6B7280' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200" style={{ color: '#111827' }}>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 !text-gray-900" style={{ color: '#111827' }}>
                          {order.orderId}
                        </div>
                        <div className="text-sm text-gray-500 !text-gray-500" style={{ color: '#6B7280' }}>
                          {order.items}
                        </div>
                        <div className="text-xs text-gray-400 !text-gray-400" style={{ color: '#9CA3AF' }}>
                          Created: {order.createdAt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 !text-gray-900" style={{ color: '#111827' }}>
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500 !text-gray-500" style={{ color: '#6B7280' }}>
                          {order.customerEmail}
                        </div>
                        <div className="text-sm text-gray-500 !text-gray-500" style={{ color: '#6B7280' }}>
                          {order.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            <span className="mr-1">{getStatusIcon(order.status)}</span>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        {order.estimatedDelivery && (
                          <div className="text-xs text-gray-500 !text-gray-500" style={{ color: '#6B7280' }}>
                            Est. Delivery: {order.estimatedDelivery}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.trackingNumber ? (
                          <div className="text-sm text-gray-900 !text-gray-900 font-mono" style={{ color: '#111827' }}>
                            {order.trackingNumber}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 !text-gray-400 italic" style={{ color: '#9CA3AF' }}>
                            No tracking number
                          </div>
                        )}
                        {order.shippingAddress && (
                          <div className="text-xs text-gray-500 !text-gray-500 max-w-xs truncate" style={{ color: '#6B7280' }}>
                            {order.shippingAddress}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                                              <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 text-xs px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                      >
                        👁️ View
                      </button>
                                              <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 text-gray-900 !text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
                        style={{ color: '#111827' }}
                      >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                         <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold">Add New Shipping Item</h2>
               <button
                 onClick={() => setShowAddOrder(false)}
                 className="text-gray-500 hover:text-gray-700 text-2xl"
               >
                 ×
               </button>
             </div>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Quotation ID *
                 </label>
                 <input
                   type="text"
                   value={newOrder.quotationId}
                   onChange={(e) => setNewOrder({...newOrder, quotationId: e.target.value})}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                   style={{ color: '#111827' }}
                   placeholder="GFJ-QT-20250803-031"
                 />
                 <p className="text-xs text-gray-500 mt-1">Enter the quotation ID to link with shipping</p>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Tracking ID *
                 </label>
                 <input
                   type="text"
                   value={newOrder.trackingNumber}
                   onChange={(e) => setNewOrder({...newOrder, trackingNumber: e.target.value})}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                   style={{ color: '#111827' }}
                   placeholder="qwertyui"
                 />
                 <p className="text-xs text-gray-500 mt-1">Enter the tracking number for the shipment</p>
               </div>
             </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddOrder(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
                             <button
                 onClick={handleAddOrder}
                 className="px-6 py-2 bg-[var(--brand-gold)] hover:bg-[var(--brand-yellow)] text-black rounded-lg font-semibold transition-colors"
               >
                 Add Shipping Item
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
};

export default ShippingTracker; 