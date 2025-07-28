import api from './api';

// SensorReading API endpoints
export const sensorReadingService = {
  // GET /api/SensorReading/All
  getAll: () => api.get('/SensorReading/All'),
  
  // GET /api/SensorReading/{id}
  getById: (id) => api.get(`/SensorReading/${id}`),
  
  // POST /api/SensorReading
  create: (sensorReadingData) => api.post('/SensorReading', sensorReadingData),
  
  // PUT /api/SensorReading/{id}
  update: (id, sensorReadingData) => api.put(`/SensorReading/${id}`, sensorReadingData),
  
  // DELETE /api/SensorReading/{id}
  delete: (id) => api.delete(`/SensorReading/${id}`),
  
  // GET /api/SensorReading/Filter
  getFiltered: (filters) => api.get('/SensorReading/Filter', { params: filters }),

  // Helper methods for sensor reading operations
  getReadingsBySensor: async (sensorId, limit = 100) => {
    const response = await api.get('/SensorReading/Filter', { 
      params: { sensorId, limit, sortBy: 'timestamp', sortOrder: 'desc' } 
    });
    return response.data || [];
  },

  getLatestReadings: async (limit = 50) => {
    const response = await api.get('/SensorReading/Filter', { 
      params: { limit, sortBy: 'timestamp', sortOrder: 'desc' } 
    });
    return response.data || [];
  },

  getReadingsByDateRange: async (startDate, endDate, sensorId = null) => {
    const params = { startDate, endDate };
    if (sensorId) params.sensorId = sensorId;
    
    const response = await api.get('/SensorReading/Filter', { params });
    return response.data || [];
  },

  getAverageReadings: async (sensorId, hours = 24) => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (hours * 60 * 60 * 1000));
    
    const response = await api.get('/SensorReading/Filter', { 
      params: { 
        sensorId, 
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      } 
    });
    
    const readings = response.data || [];
    if (readings.length === 0) return 0;
    
    const sum = readings.reduce((total, reading) => total + (reading.value || 0), 0);
    return sum / readings.length;
  }
};

export default sensorReadingService;
