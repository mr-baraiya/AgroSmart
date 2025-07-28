import api from './api';

// Weather Data API endpoints
export const weatherService = {
  // GET /api/WeatherData/All
  getAll: () => api.get('/WeatherData/All'),
  
  // GET /api/WeatherData/{id}
  getById: (id) => api.get(`/WeatherData/${id}`),
  
  // POST /api/WeatherData
  create: (weatherData) => api.post('/WeatherData', weatherData),
  
  // PUT /api/WeatherData/{id}
  update: (id, weatherData) => api.put(`/WeatherData/${id}`, weatherData),
  
  // DELETE /api/WeatherData/{id}
  delete: (id) => api.delete(`/WeatherData/${id}`),
  
  // GET /api/WeatherData/TopTemperatures
  getTopTemperatures: () => api.get('/WeatherData/TopTemperatures'),
  
  // GET /api/WeatherData/Filter
  getFiltered: (filters) => api.get('/WeatherData/Filter', { params: filters }),

  // Helper methods for weather-specific operations
  getCurrentWeather: async () => {
    const response = await api.get('/WeatherData/All');
    const weatherData = response.data;
    return weatherData && weatherData.length > 0 ? weatherData[0] : null;
  },

  getWeatherForecast: async (days = 7) => {
    const response = await api.get('/WeatherData/Filter', { 
      params: { limit: days, sortBy: 'date', sortOrder: 'desc' } 
    });
    return response.data || [];
  }
};

export default weatherService;
