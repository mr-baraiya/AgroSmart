import api from './api';

const API_BASE_URL = '/api/WeatherData';

export const userWeatherService = {
  // Get all weather data for current user
  getAllUserWeatherData: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching user weather data:', error);
      throw error;
    }
  },

  // Get weather data by ID (with ownership validation)
  getWeatherDataById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching weather data by ID:', error);
      throw error;
    }
  },

  // Create new weather data for current user
  createWeatherData: async (weatherData) => {
    try {
      const response = await api.post(API_BASE_URL, weatherData);
      return response;
    } catch (error) {
      console.error('Error creating weather data:', error);
      throw error;
    }
  },

  // Update weather data (with ownership validation)
  updateWeatherData: async (id, weatherData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, weatherData);
      return response;
    } catch (error) {
      console.error('Error updating weather data:', error);
      throw error;
    }
  },

  // Delete weather data (with ownership validation)
  deleteWeatherData: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting weather data:', error);
      throw error;
    }
  },

  // Get top temperatures for current user's locations
  getTopTemperatures: async (params = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/TopTemperatures`, {
        params
      });
      return response;
    } catch (error) {
      console.error('Error fetching top temperatures:', error);
      throw error;
    }
  },

  // Filter weather data for current user
  filterWeatherData: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering weather data:', error);
      throw error;
    }
  }
};

export default userWeatherService;
