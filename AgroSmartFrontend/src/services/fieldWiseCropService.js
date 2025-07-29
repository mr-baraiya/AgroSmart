import api from './api';

// FieldWiseCrop API endpoints
export const fieldWiseCropService = {
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
  getFiltered: async (filters) => {
    console.log('fieldWiseCropService.getFiltered called with filters:', filters);
    
    try {
      const response = await api.get('/FieldWiseCrop/filter', { params: filters });
      console.log('FieldWiseCrop API Response Status:', response.status);
      console.log('FieldWiseCrop API Response Data:', response.data);
      
      if (Array.isArray(response.data)) return response;
      if (response.data && Array.isArray(response.data.items)) {
        return { ...response, data: response.data.items };
      }
      return { ...response, data: [] };
    } catch (error) {
      console.error('fieldWiseCropService.getFiltered Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

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
