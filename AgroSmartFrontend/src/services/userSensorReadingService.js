import api from './api';

const API_BASE_URL = '/api/SensorReading';

export const userSensorReadingService = {
  // Get all sensor readings for current user
  getAllUserSensorReadings: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching user sensor readings:', error);
      throw error;
    }
  },

  // Get sensor reading by ID (with ownership validation)
  getSensorReadingById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching sensor reading by ID:', error);
      throw error;
    }
  },

  // Create new sensor reading for current user
  createSensorReading: async (sensorReadingData) => {
    try {
      const response = await api.post(API_BASE_URL, sensorReadingData);
      return response;
    } catch (error) {
      console.error('Error creating sensor reading:', error);
      throw error;
    }
  },

  // Update sensor reading (with ownership validation)
  updateSensorReading: async (id, sensorReadingData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, sensorReadingData);
      return response;
    } catch (error) {
      console.error('Error updating sensor reading:', error);
      throw error;
    }
  },

  // Delete sensor reading (with ownership validation)
  deleteSensorReading: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting sensor reading:', error);
      throw error;
    }
  },

  // Filter sensor readings for current user
  filterSensorReadings: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering sensor readings:', error);
      throw error;
    }
  }
};

export default userSensorReadingService;
