import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { shippingApi } from '../../../app/shippingApi';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  // Get original API data if available
  const originalData = order.originalData;
  
  // State for tracking ID update
  const [trackingId, setTrackingId] = useState(order.trackingNumber || '');
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  // Function to update tracking ID
  const handleUpdateTrackingId = async () => {
    if (!trackingId.trim()) {
      toast.error('Tracking ID cannot be empty');
      return;
    }

    try {
      setIsUpdatingTracking(true);
      // Call the API to update tracking ID
      await shippingApi.updateShippingItem(order.id, {
        ...originalData,
        trackingId: trackingId.trim()
      });
      
      toast.success('Tracking ID updated successfully!');
      // Close modal to refresh the main list
      onClose();
    } catch (error) {
      console.error('Error updating tracking ID:', error);
      toast.error('Failed to update tracking ID');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white">📦</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Shipping Details</h2>
              <p className="text-gray-600 font-medium">Shipping ID: {order.orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-md"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

                 <div className="p-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Left Column - Shipping Information */}
             <div className="space-y-8">
                             <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📋</span>
                   Shipping Info
                 </h3>
                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 space-y-4 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                                         <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                       order.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200' :
                       order.status === 'processing' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200' :
                       order.status === 'shipped' ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200' :
                       order.status === 'delivered' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                       'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                     }`}>
                       {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                     </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{order.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{order.updatedAt}</span>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Delivery:</span>
                      <span className="font-medium">{order.estimatedDelivery}</span>
                    </div>
                  )}
                  {originalData?.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Created:</span>
                      <span className="font-medium">
                        {new Date(originalData.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {originalData?.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Updated:</span>
                      <span className="font-medium">
                        {new Date(originalData.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

                             <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">👤</span>
                   Customer Information
                 </h3>
                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 space-y-4 shadow-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Shipping Address:</span>
                    <p className="font-medium">{order.shippingAddress}</p>
                  </div>
                                     {originalData?.clientDetails && (
                     <>
                       <div>
                         <span className="text-gray-600">City:</span>
                         <p className="font-medium">{originalData.clientDetails.city || 'N/A'}</p>
                       </div>
                       <div>
                         <span className="text-gray-600">State:</span>
                         <p className="font-medium">{originalData.clientDetails.state || 'N/A'}</p>
                       </div>
                       <div>
                         <span className="text-gray-600">Country:</span>
                         <p className="font-medium">{originalData.clientDetails.country || 'N/A'}</p>
                       </div>
                       <div>
                         <span className="text-gray-600">ZIP Code:</span>
                         <p className="font-medium">{originalData.clientDetails.zipCode || 'N/A'}</p>
                       </div>
                     </>
                   )}
                </div>
              </div>

                             <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">💎</span>
                   Items & Quotation Details
                 </h3>
                 <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100 space-y-4 shadow-sm">
                  <div>
                    <span className="text-gray-600">Description:</span>
                    <p className="font-medium">{order.items}</p>
                  </div>
                  {originalData?.quotationDetails && (
                    <>
                      <div>
                        <span className="text-gray-600">Quotation ID:</span>
                        <p className="font-medium">{originalData.quotationDetails.quotationId || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <p className="font-medium">${originalData.quotationDetails.price?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quotation Status:</span>
                                                 <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                           originalData.quotationDetails.quotationStatus === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200' :
                           originalData.quotationDetails.quotationStatus === 'approved' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                           originalData.quotationDetails.quotationStatus === 'rejected' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200' :
                           'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                         }`}>
                           {originalData.quotationDetails.quotationStatus?.charAt(0).toUpperCase() + originalData.quotationDetails.quotationStatus?.slice(1) || 'N/A'}
                         </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quotation Created:</span>
                        <p className="font-medium">
                          {originalData.quotationDetails.createdAt ? 
                            new Date(originalData.quotationDetails.createdAt).toLocaleDateString() : 'N/A'
                          }
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

                             {order.notes && (
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">📝</span>
                     Notes
                   </h3>
                   <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
                     <p className="text-gray-700 font-medium">{order.notes}</p>
                   </div>
                 </div>
               )}

                             {/* Additional Shipping Details */}
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">🚚</span>
                   Shipping Details
                 </h3>
                 <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100 space-y-4 shadow-sm">
                   <div>
                     <span className="text-gray-600">Shipping ID:</span>
                     <p className="font-medium">{order.orderId}</p>
                   </div>
                   <div>
                     <span className="text-gray-600">Tracking ID:</span>
                     <p className="font-medium">{order.trackingNumber || 'Not assigned'}</p>
                   </div>
                   {originalData?.quotationId && (
                     <div>
                       <span className="text-gray-600">Linked Quotation ID:</span>
                       <p className="font-medium">{originalData.quotationId}</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>

                         {/* Right Column - Actions and Quick Info */}
             <div className="space-y-8">
               {/* Quick Status Summary */}
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">📊</span>
                   Quick Summary
                 </h3>
                 <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 space-y-4 shadow-sm">
                   <div className="flex justify-between items-center">
                     <span className="text-gray-600">Current Status:</span>
                     <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                       order.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200' :
                       order.status === 'processing' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200' :
                       order.status === 'shipped' ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200' :
                       order.status === 'delivered' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                       'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                     }`}>
                       {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                     </span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Customer:</span>
                     <span className="font-medium">{order.customerName}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Items:</span>
                     <span className="font-medium text-sm">{order.items}</span>
                   </div>
                 </div>
               </div>

               {/* Tracking Number */}
               {order.trackingNumber && (
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">🔍</span>
                     Tracking Number
                   </h3>
                   <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100 shadow-sm">
                     <div className="flex items-center justify-between">
                       <span className="font-mono text-lg">{order.trackingNumber}</span>
                       <button
                         onClick={() => {
                           navigator.clipboard.writeText(order.trackingNumber);
                           toast.success('Tracking number copied to clipboard!');
                         }}
                         className="text-blue-600 hover:text-blue-800 text-sm"
                       >
                         Copy
                       </button>
                     </div>
                   </div>
                 </div>
               )}

                               {/* Status Update */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">⚙️</span>
                    Update Status
                  </h3>
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100 shadow-sm">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-gold)] focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Update Tracking ID */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">🔗</span>
                    Update Tracking ID
                  </h3>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 shadow-sm space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tracking ID
                      </label>
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter tracking ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleUpdateTrackingId}
                      disabled={isUpdatingTracking}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                    >
                      {isUpdatingTracking ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Updating...
                        </span>
                      ) : (
                        '🔗 Update Tracking ID'
                      )}
                    </button>
                  </div>
                </div>

               {/* Quick Actions */}
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">⚡</span>
                   Quick Actions
                 </h3>
                 <div className="space-y-3">
                   <button
                     onClick={() => {
                       navigator.clipboard.writeText(order.orderId);
                       toast.success('Shipping ID copied to clipboard!');
                     }}
                     className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                   >
                     📋 Copy Shipping ID
                   </button>
                   <button
                     onClick={() => {
                       const customerInfo = `Name: ${order.customerName}\nEmail: ${order.customerEmail}\nPhone: ${order.customerPhone}\nAddress: ${order.shippingAddress}`;
                       navigator.clipboard.writeText(customerInfo);
                       toast.success('Customer info copied to clipboard!');
                     }}
                     className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                   >
                     👤 Copy Customer Info
                   </button>
                 </div>
               </div>
             </div>
          </div>
        </div>

                 {/* Footer */}
         <div className="flex justify-end space-x-4 p-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl">
           <button
             onClick={onClose}
             className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
           >
             ✕ Close
           </button>
         </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 