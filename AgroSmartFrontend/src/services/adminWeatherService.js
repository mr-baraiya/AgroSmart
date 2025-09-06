import api from './api';

const API_BASE_URL = '/api/WeatherData';

export const adminWeatherService = {
  // Get all weather data (admin access)
  getAllWeatherData: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all weather data (admin):', error);
      throw error;
    }
  },

  // Get weather data by ID (admin access)
  getWeatherDataById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching weather data by ID (admin):', error);
      throw error;
    }
  },

  // Create new weather data (admin)
  createWeatherData: async (weatherData) => {
    try {
      const response = await api.post(API_BASE_URL, weatherData);
      return response;
    } catch (error) {
      console.error('Error creating weather data (admin):', error);
      throw error;
    }
  },

  // Update weather data (admin access)
  updateWeatherData: async (id, weatherData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, weatherData);
      return response;
    } catch (error) {
      console.error('Error updating weather data (admin):', error);
      throw error;
    }
  },

  // Delete weather data (admin access)
  deleteWeatherData: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting weather data (admin):', error);
      throw error;
    }
  },

  // Get top temperatures (admin access)
  getTopTemperatures: async (params = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/TopTemperatures`, {
        params
      });
      return response;
    } catch (error) {
      console.error('Error fetching top temperatures (admin):', error);
      throw error;
    }
  },

  // Filter weather data (admin access)
  filterWeatherData: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering weather data (admin):', error);
      throw error;
    }
  }
};

export default adminWeatherService;
