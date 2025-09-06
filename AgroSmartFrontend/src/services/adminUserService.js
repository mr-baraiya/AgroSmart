import api from './api';

const API_BASE_URL = '/api/User';

export const adminUserService = {
  // Get all users (admin access only)
  getAllUsers: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all users (admin):', error);
      throw error;
    }
  },

  // Get user by ID (admin access)
  getUserById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching user by ID (admin):', error);
      throw error;
    }
  },

  // Update user (admin access)
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, userData);
      return response;
    } catch (error) {
      console.error('Error updating user (admin):', error);
      throw error;
    }
  },

  // Soft delete user (admin access only)
  softDeleteUser: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/SoftDelete/${id}`);
      return response;
    } catch (error) {
      console.error('Error soft deleting user (admin):', error);
      throw error;
    }
  },

  // Hard delete user (admin access only)
  hardDeleteUser: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/HardDelete/${id}`);
      return response;
    } catch (error) {
      console.error('Error hard deleting user (admin):', error);
      throw error;
    }
  },

  // Filter users (admin access)
  filterUsers: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering users (admin):', error);
      throw error;
    }
  },

  // Upload profile picture for any user (admin access)
  uploadUserProfilePicture: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`${API_BASE_URL}/${userId}/UploadProfilePicture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error uploading user profile picture (admin):', error);
      throw error;
    }
  },

  // Delete profile picture for any user (admin access)
  deleteUserProfilePicture: async (userId) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${userId}/DeleteProfilePicture`);
      return response;
    } catch (error) {
      console.error('Error deleting user profile picture (admin):', error);
      throw error;
    }
  }
};

export default adminUserService;
