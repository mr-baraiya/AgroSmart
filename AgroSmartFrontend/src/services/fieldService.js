import api from './api';

// Field API endpoints
export const fieldService = {
  // GET /api/Field/All
  getAll: async () => {
    const response = await api.get('/Field/All');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Field/{id}
  getById: async (id) => {
    try {
      const response = await api.get(`/Field/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching field with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST /api/Field
  create: (fieldData) => api.post('/Field', fieldData),
  
  // PUT /api/Field/{id}
  update: (id, fieldData) => api.put(`/Field/${id}`, fieldData),
  
  // DELETE /api/Field/{id}
  delete: (id) => api.delete(`/Field/${id}`),
  
  // GET /api/Field/dropdown
  getDropdown: async () => {
    const response = await api.get('/Field/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Field/filter
  getFiltered: async (filters) => {
    console.log('fieldService.getFiltered called with filters:', filters);
    
    try {
      const response = await api.get('/Field/filter', { params: filters });
      console.log('Field API Response Status:', response.status);
      console.log('Field API Response Data:', response.data);
      
      if (Array.isArray(response.data)) return response;
      if (response.data && Array.isArray(response.data.items)) {
        return { ...response, data: response.data.items };
      }
      return { ...response, data: [] };
    } catch (error) {
      console.error('fieldService.getFiltered Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }
};

export default fieldService;
