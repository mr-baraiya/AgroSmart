import api from './api';

// FieldWiseCrop API endpoints
export const fieldWiseCropService = {
  // GET /api/FieldWiseCrop/All
  getAll: () => api.get('/FieldWiseCrop/All'),
  
  // GET /api/FieldWiseCrop/{id}
  getById: (id) => api.get(`/FieldWiseCrop/${id}`),
  
  // POST /api/FieldWiseCrop
  create: (fieldWiseCropData) => api.post('/FieldWiseCrop', fieldWiseCropData),
  
  // PUT /api/FieldWiseCrop/{id}
  update: (id, fieldWiseCropData) => api.put(`/FieldWiseCrop/${id}`, fieldWiseCropData),
  
  // DELETE /api/FieldWiseCrop/{id}
  delete: (id) => api.delete(`/FieldWiseCrop/${id}`),
  
  // GET /api/FieldWiseCrop/filter
  getFiltered: (filters) => api.get('/FieldWiseCrop/filter', { params: filters }),

  // Helper methods for field-wise crop operations
  getCropsByField: async (fieldId) => {
    const response = await api.get('/FieldWiseCrop/filter', { 
      params: { fieldId } 
    });
    return response.data || [];
  },

  getFieldsByCrop: async (cropId) => {
    const response = await api.get('/FieldWiseCrop/filter', { 
      params: { cropId } 
    });
    return response.data || [];
  },

  getActiveCrops: async () => {
    const response = await api.get('/FieldWiseCrop/filter', { 
      params: { isActive: true } 
    });
    return response.data || [];
  }
};

export default fieldWiseCropService;
