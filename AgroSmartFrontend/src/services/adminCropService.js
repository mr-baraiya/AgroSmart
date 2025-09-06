import api from './api';

const API_BASE_URL = '/api/Crop';

export const adminCropService = {
  // Get all crops (admin access)
  getAllCrops: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all crops (admin):', error);
      throw error;
    }
  },

  // Get crop by ID (admin access)
  getCropById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching crop by ID (admin):', error);
      throw error;
    }
  },

  // Create new crop (admin)
  createCrop: async (cropData) => {
    try {
      const response = await api.post(API_BASE_URL, cropData);
      return response;
    } catch (error) {
      console.error('Error creating crop (admin):', error);
      throw error;
    }
  },

  // Update crop (admin access)
  updateCrop: async (id, cropData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, cropData);
      return response;
    } catch (error) {
      console.error('Error updating crop (admin):', error);
      throw error;
    }
  },

  // Delete crop (admin access)
  deleteCrop: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting crop (admin):', error);
      throw error;
    }
  },

  // Get crop dropdown (admin access)
  getCropDropdown: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/dropdown`);
      return response;
    } catch (error) {
      console.error('Error fetching crop dropdown (admin):', error);
      throw error;
    }
  },

  // Filter crops (admin access)
  filterCrops: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering crops (admin):', error);
      throw error;
    }
  }
};

export default adminCropService;
