import api from './api';

const API_BASE_URL = '/api/SmartInsight';

export const adminSmartInsightService = {
  // Get all smart insights (admin access)
  getAllSmartInsights: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all smart insights (admin):', error);
      throw error;
    }
  },

  // Get smart insight by ID (admin access)
  getSmartInsightById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching smart insight by ID (admin):', error);
      throw error;
    }
  },

  // Create new smart insight (admin)
  createSmartInsight: async (smartInsightData) => {
    try {
      const response = await api.post(API_BASE_URL, smartInsightData);
      return response;
    } catch (error) {
      console.error('Error creating smart insight (admin):', error);
      throw error;
    }
  },

  // Update smart insight (admin access)
  updateSmartInsight: async (id, smartInsightData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, smartInsightData);
      return response;
    } catch (error) {
      console.error('Error updating smart insight (admin):', error);
      throw error;
    }
  },

  // Delete smart insight (admin access)
  deleteSmartInsight: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting smart insight (admin):', error);
      throw error;
    }
  },

  // Filter smart insights (admin access)
  filterSmartInsights: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering smart insights (admin):', error);
      throw error;
    }
  }
};

export default adminSmartInsightService;
