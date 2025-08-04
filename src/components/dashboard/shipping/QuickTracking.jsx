import React, { useState } from 'react';

const QuickTracking = ({ orders, onTrackOrder }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackOrder = () => {
    if (!trackingNumber.trim()) {
      return;
    }

    setIsTracking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const order = orders.find(o => 
        o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
      );
      
      setTrackingResult(order);
      setIsTracking(false);
      
      if (order && onTrackOrder) {
        onTrackOrder(order);
      }
    }, 1000);
  };

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Order Tracking</h3>
      
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent text-gray-900 !text-gray-900"
          style={{ color: '#111827' }}
          onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
        />
        <button
          onClick={handleTrackOrder}
          disabled={isTracking || !trackingNumber.trim()}
          className="px-6 py-2 bg-[var(--brand-gold)] hover:bg-[var(--brand-yellow)] text-black rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTracking ? '🔍 Tracking...' : '🔍 Track'}
        </button>
      </div>

      {trackingResult && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Order Found</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(trackingResult.status)}`}>
              <span className="mr-1">{getStatusIcon(trackingResult.status)}</span>
              {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Order ID:</span>
              <p className="font-medium">{trackingResult.orderId}</p>
            </div>
            <div>
              <span className="text-gray-600">Customer:</span>
              <p className="font-medium">{trackingResult.customerName}</p>
            </div>
            <div>
              <span className="text-gray-600">Items:</span>
              <p className="font-medium">{trackingResult.items}</p>
            </div>
            <div>
              <span className="text-gray-600">Est. Delivery:</span>
              <p className="font-medium">{trackingResult.estimatedDelivery || 'Not specified'}</p>
            </div>
          </div>
          
          {trackingResult.shippingAddress && (
            <div className="mt-3">
              <span className="text-gray-600 text-sm">Shipping Address:</span>
              <p className="font-medium text-sm">{trackingResult.shippingAddress}</p>
            </div>
          )}
        </div>
      )}

      {trackingResult === null && !isTracking && trackingNumber && (
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">❌</span>
            <p className="text-red-700">No order found with this tracking number.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickTracking; 