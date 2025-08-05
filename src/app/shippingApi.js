import apiClient from './axiosConfig';

// Shipping API service
export const shippingApi = {
  // Get all shipping items
  getAllShippingItems: async () => {
    try {
      const response = await apiClient.get('/shipping/getAllShippingItems');
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping items:', error);
      throw error;
    }
  },

  // Get shipping item by ID
  getShippingItemById: async (id) => {
    try {
      const response = await apiClient.get(`/shipping/getShippingItem/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping item:', error);
      throw error;
    }
  },

  // Create new shipping item
  createShippingItem: async (shippingData) => {
    try {
      const response = await apiClient.post('/shipping/addShippingItem', shippingData);
      return response.data;
    } catch (error) {
      console.error('Error creating shipping item:', error);
      throw error;
    }
  },

  // Update shipping item
  updateShippingItem: async (id, shippingData) => {
    try {
      const response = await apiClient.put(`/shipping/updateShippingItem/${id}`, shippingData);
      return response.data;
    } catch (error) {
      console.error('Error updating shipping item:', error);
      throw error;
    }
  },

  // Delete shipping item
  deleteShippingItem: async (id) => {
    try {
      const response = await apiClient.delete(`/shipping/deleteShippingItem/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting shipping item:', error);
      throw error;
    }
  },

  // Update shipping status
  updateShippingStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/shipping/updateStatus/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating shipping status:', error);
      throw error;
    }
  },

  // Track shipping by tracking ID
  trackShipping: async (trackingId) => {
    try {
      const response = await apiClient.get(`/shipping/track/${trackingId}`);
      return response.data;
    } catch (error) {
      console.error('Error tracking shipping:', error);
      throw error;
    }
  }
};

export default shippingApi; 