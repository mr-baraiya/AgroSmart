import api from './api';

const API_BASE_URL = '/api/Farm';

export const adminFarmService = {
  // Get all farms (admin access)
  getAllFarms: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all farms (admin):', error);
      throw error;
    }
  },

  // Get farm by ID (admin access)
  getFarmById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching farm by ID (admin):', error);
      throw error;
    }
  },

  // Create new farm (admin)
  createFarm: async (farmData) => {
    try {
      const response = await api.post(API_BASE_URL, farmData);
      return response;
    } catch (error) {
      console.error('Error creating farm (admin):', error);
      throw error;
    }
  },

  // Update farm (admin access)
  updateFarm: async (id, farmData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, farmData);
      return response;
    } catch (error) {
      console.error('Error updating farm (admin):', error);
      throw error;
    }
  },

  // Delete farm (admin access)
  deleteFarm: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting farm (admin):', error);
      throw error;
    }
  },

  // Get farm dropdown (admin access)
  getFarmDropdown: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/dropdown`);
      return response;
    } catch (error) {
      console.error('Error fetching farm dropdown (admin):', error);
      throw error;
    }
  },

  // Filter farms (admin access)
  filterFarms: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering farms (admin):', error);
      throw error;
    }
  }
};

export default adminFarmService;
