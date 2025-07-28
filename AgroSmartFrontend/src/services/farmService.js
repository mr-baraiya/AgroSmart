import api from './api';

// Farm API endpoints
export const farmService = {
  // GET /api/Farm/All
  getAll: () => api.get('/Farm/All'),
  
  // GET /api/Farm/{id}
  getById: (id) => api.get(`/Farm/${id}`),
  
  // POST /api/Farm
  create: (farmData) => api.post('/Farm', farmData),
  
  // PUT /api/Farm/{id}
  update: (id, farmData) => api.put(`/Farm/${id}`, farmData),
  
  // DELETE /api/Farm/{id}
  delete: (id) => api.delete(`/Farm/${id}`),
  
  // GET /api/Farm/dropdown
  getDropdown: () => api.get('/Farm/dropdown'),
  
  // GET /api/Farm/filter
  getFiltered: (filters) => api.get('/Farm/filter', { params: filters })
};

export default farmService;
