import api from './api';

const API_BASE_URL = '/api/SensorReading';

export const adminSensorReadingService = {
  // Get all sensor readings (admin access)
  getAllSensorReadings: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all sensor readings (admin):', error);
      throw error;
    }
  },

  // Get sensor reading by ID (admin access)
  getSensorReadingById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching sensor reading by ID (admin):', error);
      throw error;
    }
  },

  // Create new sensor reading (admin)
  createSensorReading: async (sensorReadingData) => {
    try {
      const response = await api.post(API_BASE_URL, sensorReadingData);
      return response;
    } catch (error) {
      console.error('Error creating sensor reading (admin):', error);
      throw error;
    }
  },

  // Update sensor reading (admin access)
  updateSensorReading: async (id, sensorReadingData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, sensorReadingData);
      return response;
    } catch (error) {
      console.error('Error updating sensor reading (admin):', error);
      throw error;
    }
  },

  // Delete sensor reading (admin access)
  deleteSensorReading: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting sensor reading (admin):', error);
      throw error;
    }
  },

  // Filter sensor readings (admin access)
  filterSensorReadings: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering sensor readings (admin):', error);
      throw error;
    }
  }
};

export default adminSensorReadingService;
