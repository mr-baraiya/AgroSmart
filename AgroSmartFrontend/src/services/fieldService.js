import api from './api';

// Field API endpoints
export const fieldService = {
  // GET /api/Field/All
  getAll: () => api.get('/Field/All'),
  
  // GET /api/Field/{id}
  getById: (id) => api.get(`/Field/${id}`),
  
  // POST /api/Field
  create: (fieldData) => api.post('/Field', fieldData),
  
  // PUT /api/Field/{id}
  update: (id, fieldData) => api.put(`/Field/${id}`, fieldData),
  
  // DELETE /api/Field/{id}
  delete: (id) => api.delete(`/Field/${id}`),
  
  // GET /api/Field/dropdown
  getDropdown: () => api.get('/Field/dropdown'),
  
  // GET /api/Field/filter
  getFiltered: (filters) => api.get('/Field/filter', { params: filters })
};

export default fieldService;
