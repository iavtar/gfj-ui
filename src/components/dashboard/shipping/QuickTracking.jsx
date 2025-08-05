import React, { useState } from 'react';
import { shippingApi } from '../../../app/shippingApi';
import { toast } from 'react-toastify';

const QuickTracking = ({ orders, onTrackOrder }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsTracking(true);
    
    try {
      // Search in local orders by tracking number
      let order = orders.find(o => 
        o.trackingNumber && o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
      );
      
      // Also search by order ID as fallback
      if (!order) {
        order = orders.find(o => 
          o.orderId && o.orderId.toLowerCase() === trackingNumber.toLowerCase()
        );
      }
      
      // If not found locally, try to get all orders and search again
      if (!order) {
        try {
          const allOrders = await shippingApi.getAllShippingItems();
          const transformedOrders = allOrders.map(item => ({
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
            originalData: item
          }));
          
          order = transformedOrders.find(o => 
            (o.trackingNumber && o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()) ||
            (o.orderId && o.orderId.toLowerCase() === trackingNumber.toLowerCase())
          );
        } catch (apiError) {
          console.error('Error fetching orders for tracking:', apiError);
        }
      }
      
      setTrackingResult(order);
      
      if (order && onTrackOrder) {
        onTrackOrder(order);
      }
      
      if (!order) {
        toast.error('No order found with this tracking number or order ID');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Failed to track order');
      setTrackingResult(null);
    } finally {
      setIsTracking(false);
    }
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
      
      <div className="space-y-3 mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter tracking number or order ID"
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
        <p className="text-xs text-gray-500">
          💡 You can search by tracking number (e.g., "cvdfvfvfdvfdvdf") or order ID (e.g., "GFJ-SHP-20250805-001")
        </p>
      </div>

      {trackingResult && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 text-lg">✅ Order Found</h4>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(trackingResult.status)}`}>
              <span className="mr-1">{getStatusIcon(trackingResult.status)}</span>
              {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm space-y-3">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="text-gray-600 text-xs uppercase tracking-wide">Order ID:</span>
              <p className="font-semibold text-gray-900">{trackingResult.orderId}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="text-gray-600 text-xs uppercase tracking-wide">Customer:</span>
              <p className="font-semibold text-gray-900">{trackingResult.customerName}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="text-gray-600 text-xs uppercase tracking-wide">Items:</span>
              <p className="font-semibold text-gray-900">{trackingResult.items}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="text-gray-600 text-xs uppercase tracking-wide">Tracking Number:</span>
              <p className="font-semibold text-gray-900 font-mono">{trackingResult.trackingNumber || 'Not assigned'}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="text-gray-600 text-xs uppercase tracking-wide">Est. Delivery:</span>
              <p className="font-semibold text-gray-900">{trackingResult.estimatedDelivery || 'Not specified'}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="text-gray-600 text-xs uppercase tracking-wide">Created:</span>
              <p className="font-semibold text-gray-900">{trackingResult.createdAt}</p>
            </div>
          </div>
          
          {trackingResult.shippingAddress && (
            <div className="mt-4 bg-white p-3 rounded-lg border border-green-200">
              <span className="text-gray-600 text-xs uppercase tracking-wide">Shipping Address:</span>
              <p className="font-semibold text-gray-900 text-sm">{trackingResult.shippingAddress}</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setTrackingNumber('');
                setTrackingResult(null);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Clear & Search Again
            </button>
          </div>
        </div>
      )}

      {trackingResult === null && !isTracking && trackingNumber && (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-red-500 mr-2 text-xl">❌</span>
              <h4 className="font-bold text-red-900">No Order Found</h4>
            </div>
          </div>
          <p className="text-red-700 mb-4">
            No order found with tracking number or order ID: <span className="font-mono font-semibold">{trackingNumber}</span>
          </p>
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">
              <strong>💡 Tips:</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>• Check if the tracking number is correct</li>
              <li>• Try searching by order ID instead</li>
              <li>• Make sure the order exists in the system</li>
            </ul>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setTrackingNumber('');
                setTrackingResult(null);
              }}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickTracking; 