import api from './api';

const API_BASE_URL = '/api/Field';

export const adminFieldService = {
  // Get all fields (admin access)
  getAllFields: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all fields (admin):', error);
      throw error;
    }
  },

  // Get field by ID (admin access)
  getFieldById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching field by ID (admin):', error);
      throw error;
    }
  },

  // Create new field (admin)
  createField: async (fieldData) => {
    try {
      const response = await api.post(API_BASE_URL, fieldData);
      return response;
    } catch (error) {
      console.error('Error creating field (admin):', error);
      throw error;
    }
  },

  // Update field (admin access)
  updateField: async (id, fieldData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, fieldData);
      return response;
    } catch (error) {
      console.error('Error updating field (admin):', error);
      throw error;
    }
  },

  // Delete field (admin access)
  deleteField: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting field (admin):', error);
      throw error;
    }
  },

  // Get field dropdown (admin access)
  getFieldDropdown: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/dropdown`);
      return response;
    } catch (error) {
      console.error('Error fetching field dropdown (admin):', error);
      throw error;
    }
  },

  // Filter fields (admin access)
  filterFields: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering fields (admin):', error);
      throw error;
    }
  }
};

export default adminFieldService;
