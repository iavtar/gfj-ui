import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import OrderDetailsModal from './OrderDetailsModal';
import ShippingStats from './ShippingStats';
import QuickTracking from './QuickTracking';

const ShippingTracker = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
    notes: ''
  });

  // Mock data for demonstration
  const mockOrders = [
    {
      id: 1,
      orderId: 'GFJ-2024-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '+1-555-0123',
      shippingAddress: '123 Main Street, New York, NY 10001',
      items: 'Diamond Ring, Gold Necklace',
      status: 'shipped',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-15',
      notes: 'Fragile items - handle with care',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    },
    {
      id: 2,
      orderId: 'GFJ-2024-002',
      customerName: 'Michael Rodriguez',
      customerEmail: 'michael.rodriguez@email.com',
      customerPhone: '+1-555-0456',
      shippingAddress: '456 Oak Avenue, Los Angeles, CA 90210',
      items: 'Emerald Earrings',
      status: 'delivered',
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-08',
      notes: 'Delivered successfully',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-08'
    },
    {
      id: 3,
      orderId: 'GFJ-2024-003',
      customerName: 'Emily Chen',
      customerEmail: 'emily.chen@email.com',
      customerPhone: '+1-555-0789',
      shippingAddress: '789 Pine Street, San Francisco, CA 94102',
      items: 'Ruby Bracelet, Pearl Necklace',
      status: 'pending',
      trackingNumber: '',
      estimatedDelivery: '2024-01-20',
      notes: 'Awaiting payment confirmation',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13'
    },
    {
      id: 4,
      orderId: 'GFJ-2024-004',
      customerName: 'David Thompson',
      customerEmail: 'david.thompson@email.com',
      customerPhone: '+1-555-0321',
      shippingAddress: '321 Elm Drive, Chicago, IL 60601',
      items: 'Sapphire Ring, Diamond Earrings',
      status: 'processing',
      trackingNumber: 'TRK456789123',
      estimatedDelivery: '2024-01-18',
      notes: 'Express shipping requested',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    },
    {
      id: 5,
      orderId: 'GFJ-2024-005',
      customerName: 'Jessica Williams',
      customerEmail: 'jessica.williams@email.com',
      customerPhone: '+1-555-0654',
      shippingAddress: '654 Maple Lane, Miami, FL 33101',
      items: 'Gold Chain, Silver Bracelet',
      status: 'shipped',
      trackingNumber: 'TRK789123456',
      estimatedDelivery: '2024-01-16',
      notes: 'Signature required upon delivery',
      createdAt: '2024-01-11',
      updatedAt: '2024-01-15'
    },
    {
      id: 6,
      orderId: 'GFJ-2024-006',
      customerName: 'Robert Davis',
      customerEmail: 'robert.davis@email.com',
      customerPhone: '+1-555-0987',
      shippingAddress: '987 Cedar Road, Seattle, WA 98101',
      items: 'Platinum Ring, Diamond Pendant',
      status: 'delivered',
      trackingNumber: 'TRK321654987',
      estimatedDelivery: '2024-01-10',
      notes: 'Delivered to front desk',
      createdAt: '2024-01-06',
      updatedAt: '2024-01-10'
    },
    {
      id: 7,
      orderId: 'GFJ-2024-007',
      customerName: 'Amanda Martinez',
      customerEmail: 'amanda.martinez@email.com',
      customerPhone: '+1-555-0124',
      shippingAddress: '124 Birch Street, Austin, TX 73301',
      items: 'Rose Gold Necklace, Pearl Earrings',
      status: 'cancelled',
      trackingNumber: '',
      estimatedDelivery: '2024-01-22',
      notes: 'Order cancelled by customer',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16'
    },
    {
      id: 8,
      orderId: 'GFJ-2024-008',
      customerName: 'Christopher Lee',
      customerEmail: 'christopher.lee@email.com',
      customerPhone: '+1-555-0567',
      shippingAddress: '567 Willow Way, Denver, CO 80201',
      items: 'Tanzanite Ring, Gold Chain',
      status: 'pending',
      trackingNumber: '',
      estimatedDelivery: '2024-01-25',
      notes: 'Payment pending',
      createdAt: '2024-01-17',
      updatedAt: '2024-01-17'
    }
  ];

  useEffect(() => {
    // Load mock data
    setOrders(mockOrders);
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

  const handleAddOrder = () => {
    if (!newOrder.orderId || !newOrder.customerName) {
      toast.error('Order ID and Customer Name are required');
      return;
    }

    const order = {
      id: orders.length + 1,
      ...newOrder,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setOrders([...orders, order]);
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
      notes: ''
    });
    setShowAddOrder(false);
    toast.success('Order added successfully');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : order
    ));
    toast.success('Order status updated successfully');
  };

  const deleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
      toast.success('Order deleted successfully');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
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
          <button
            onClick={() => setShowAddOrder(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="text-lg">📦</span>
            <span>Add New Order</span>
          </button>
        </div>

        {/* Statistics */}
        <ShippingStats orders={orders} />

        {/* Quick Tracking */}
        <QuickTracking 
          orders={orders} 
          onTrackOrder={(order) => setSelectedOrder(order)} 
        />

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
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-full">
          <div className="overflow-x-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items}
                        </div>
                        <div className="text-xs text-gray-400">
                          Created: {order.createdAt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerEmail}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-xs text-gray-500 mt-1">
                          Est. Delivery: {order.estimatedDelivery}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {order.trackingNumber ? (
                          <div className="text-sm text-gray-900 font-mono">
                            {order.trackingNumber}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            No tracking number
                          </div>
                        )}
                        {order.shippingAddress && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
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
          
          {filteredOrders.length === 0 && (
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
              <h2 className="text-2xl font-bold">Add New Order</h2>
              <button
                onClick={() => setShowAddOrder(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID *
                </label>
                <input
                  type="text"
                  value={newOrder.orderId}
                  onChange={(e) => setNewOrder({...newOrder, orderId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="GFJ-2024-XXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="Customer Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={newOrder.customerEmail}
                  onChange={(e) => setNewOrder({...newOrder, customerEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="customer@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Phone
                </label>
                <PhoneInput
                  country={"us"}
                  inputProps={{
                    name: "customerPhone",
                    required: true,
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                  containerStyle={{
                    width: "100%",
                  }}
                  value={newOrder.customerPhone}
                  onChange={(value, country) => {
                    // Format phone number as +(country code)-(number)
                    const formattedValue = `+${country.dialCode}-${value.replace(country.dialCode, '')}`;
                    setNewOrder({...newOrder, customerPhone: formattedValue});
                  }}
                  placeholder="+1-555-XXXXXXX"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                                 <textarea
                   value={newOrder.shippingAddress}
                   onChange={(e) => setNewOrder({...newOrder, shippingAddress: e.target.value})}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                   style={{ color: '#111827' }}
                   rows="2"
                   placeholder="123 Main Street, City, State ZIP"
                 />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items
                </label>
                <input
                  type="text"
                  value={newOrder.items}
                  onChange={(e) => setNewOrder({...newOrder, items: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="Diamond Ring, Gold Necklace, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={newOrder.trackingNumber}
                  onChange={(e) => setNewOrder({...newOrder, trackingNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="TRKXXXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={newOrder.estimatedDelivery}
                  onChange={(e) => setNewOrder({...newOrder, estimatedDelivery: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                  style={{ color: '#111827' }}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
                  style={{ color: '#111827' }}
                  rows="2"
                  placeholder="Additional notes or special instructions"
                />
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
                Add Order
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