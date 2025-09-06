import api from './api';

const API_BASE_URL = '/api/Sensor';

export const userSensorService = {
  // Get all sensors for current user
  getAllUserSensors: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching user sensors:', error);
      throw error;
    }
  },

  // Get sensor by ID (with ownership validation)
  getSensorById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching sensor by ID:', error);
      throw error;
    }
  },

  // Create new sensor for current user
  createSensor: async (sensorData) => {
    try {
      const response = await api.post(API_BASE_URL, sensorData);
      return response;
    } catch (error) {
      console.error('Error creating sensor:', error);
      throw error;
    }
  },

  // Update sensor (with ownership validation)
  updateSensor: async (id, sensorData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, sensorData);
      return response;
    } catch (error) {
      console.error('Error updating sensor:', error);
      throw error;
    }
  },

  // Delete sensor (with ownership validation)
  deleteSensor: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting sensor:', error);
      throw error;
    }
  },

  // Get sensor dropdown for current user
  getSensorDropdown: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/Dropdown`);
      return response;
    } catch (error) {
      console.error('Error fetching sensor dropdown:', error);
      throw error;
    }
  },

  // Filter sensors for current user
  filterSensors: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering sensors:', error);
      throw error;
    }
  }
};

export default userSensorService;
