import api from './api';

const API_BASE_URL = '/api/Sensor';

export const adminSensorService = {
  // Get all sensors (admin access)
  getAllSensors: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all sensors (admin):', error);
      throw error;
    }
  },

  // Get sensor by ID (admin access)
  getSensorById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching sensor by ID (admin):', error);
      throw error;
    }
  },

  // Create new sensor (admin)
  createSensor: async (sensorData) => {
    try {
      const response = await api.post(API_BASE_URL, sensorData);
      return response;
    } catch (error) {
      console.error('Error creating sensor (admin):', error);
      throw error;
    }
  },

  // Update sensor (admin access)
  updateSensor: async (id, sensorData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, sensorData);
      return response;
    } catch (error) {
      console.error('Error updating sensor (admin):', error);
      throw error;
    }
  },

  // Delete sensor (admin access)
  deleteSensor: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting sensor (admin):', error);
      throw error;
    }
  },

  // Get sensor dropdown (admin access)
  getSensorDropdown: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/Dropdown`);
      return response;
    } catch (error) {
      console.error('Error fetching sensor dropdown (admin):', error);
      throw error;
    }
  },

  // Filter sensors (admin access)
  filterSensors: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering sensors (admin):', error);
      throw error;
    }
  }
};

export default adminSensorService;
