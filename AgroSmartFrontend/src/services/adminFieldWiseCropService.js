import api from './api';

// Admin-specific FieldWiseCrop API endpoints (full access)
export const adminFieldWiseCropService = {
  // GET /api/FieldWiseCrop/All
  getAll: async () => {
    const response = await api.get('/FieldWiseCrop/All');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/FieldWiseCrop/{id}
  getById: async (id) => {
    try {
      const response = await api.get(`/FieldWiseCrop/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching field-wise crop with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST /api/FieldWiseCrop
  create: (fieldWiseCropData) => api.post('/FieldWiseCrop', fieldWiseCropData),
  
  // PUT /api/FieldWiseCrop/{id}
  update: (id, fieldWiseCropData) => api.put(`/FieldWiseCrop/${id}`, fieldWiseCropData),
  
  // DELETE /api/FieldWiseCrop/{id}
  delete: (id) => api.delete(`/FieldWiseCrop/${id}`),
  
  // GET /api/FieldWiseCrop/filter
  filter: (filterParams) => api.get('/FieldWiseCrop/filter', { params: filterParams })
};

export default adminFieldWiseCropService;
