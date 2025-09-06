import api from './api';
import { useAuth } from '../contexts/AuthProvider';

const API_BASE_URL = '/api/FieldWiseCrop';

export const userFieldWiseCropService = {
  // Get all field-wise crops for current user
  getAllUserFieldWiseCrops: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      // Filter by user ownership will be handled by backend with JWT
      return response;
    } catch (error) {
      console.error('Error fetching user field-wise crops:', error);
      throw error;
    }
  },

  // Get field-wise crop by ID (with ownership validation)
  getFieldWiseCropById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching field-wise crop by ID:', error);
      throw error;
    }
  },

  // Create new field-wise crop for current user
  createFieldWiseCrop: async (fieldWiseCropData) => {
    try {
      const response = await api.post(API_BASE_URL, fieldWiseCropData);
      return response;
    } catch (error) {
      console.error('Error creating field-wise crop:', error);
      throw error;
    }
  },

  // Update field-wise crop (with ownership validation)
  updateFieldWiseCrop: async (id, fieldWiseCropData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, fieldWiseCropData);
      return response;
    } catch (error) {
      console.error('Error updating field-wise crop:', error);
      throw error;
    }
  },

  // Delete field-wise crop (with ownership validation)
  deleteFieldWiseCrop: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting field-wise crop:', error);
      throw error;
    }
  },

  // Filter field-wise crops for current user
  filterFieldWiseCrops: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering field-wise crops:', error);
      throw error;
    }
  }
};

export default userFieldWiseCropService;
