import api from './api';

const API_BASE_URL = '/api/SmartInsight';

export const userSmartInsightService = {
  // Get all smart insights for current user
  getAllUserSmartInsights: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching user smart insights:', error);
      throw error;
    }
  },

  // Get smart insight by ID (with ownership validation)
  getSmartInsightById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching smart insight by ID:', error);
      throw error;
    }
  },

  // Create new smart insight for current user
  createSmartInsight: async (smartInsightData) => {
    try {
      const response = await api.post(API_BASE_URL, smartInsightData);
      return response;
    } catch (error) {
      console.error('Error creating smart insight:', error);
      throw error;
    }
  },

  // Update smart insight (with ownership validation)
  updateSmartInsight: async (id, smartInsightData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, smartInsightData);
      return response;
    } catch (error) {
      console.error('Error updating smart insight:', error);
      throw error;
    }
  },

  // Delete smart insight (with ownership validation)
  deleteSmartInsight: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting smart insight:', error);
      throw error;
    }
  },

  // Filter smart insights for current user
  filterSmartInsights: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering smart insights:', error);
      throw error;
    }
  }
};

export default userSmartInsightService;
