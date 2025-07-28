import api from './api';

// Sensor API endpoints
export const sensorService = {
  // GET /api/Sensor/All
  getAll: () => api.get('/Sensor/All'),
  
  // GET /api/Sensor/{id}
  getById: (id) => api.get(`/Sensor/${id}`),
  
  // POST /api/Sensor
  create: (sensorData) => api.post('/Sensor', sensorData),
  
  // PUT /api/Sensor/{id}
  update: (id, sensorData) => api.put(`/Sensor/${id}`, sensorData),
  
  // DELETE /api/Sensor/{id}
  delete: (id) => api.delete(`/Sensor/${id}`),
  
  // GET /api/Sensor/Dropdown
  getDropdown: () => api.get('/Sensor/Dropdown'),
  
  // GET /api/Sensor/Filter
  getFiltered: (filters) => api.get('/Sensor/Filter', { params: filters })
};

export default sensorService;
