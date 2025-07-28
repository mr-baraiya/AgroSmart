import api from './api';

// Crop API endpoints
export const cropService = {
  // GET /api/Crop/All
  getAll: async () => {
    const response = await api.get('/Crop/All');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Crop/{id}
  getById: async (id) => {
    try {
      const response = await api.get(`/Crop/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching crop with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST /api/Crop
  create: (cropData) => api.post('/Crop', cropData),
  
  // PUT /api/Crop/{id}
  update: (id, cropData) => api.put(`/Crop/${id}`, cropData),
  
  // DELETE /api/Crop/{id}
  delete: (id) => api.delete(`/Crop/${id}`),
  
  // GET /api/Crop/dropdown
  getDropdown: async () => {
    const response = await api.get('/Crop/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Crop/Filter
  getFiltered: async (filters) => {
    console.log('cropService.getFiltered called with filters:', filters);
    
    try {
      const response = await api.get('/Crop/Filter', { params: filters });
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', response.data);
      console.log('API Response Headers:', response.headers);
      
      if (Array.isArray(response.data)) return response;
      if (response.data && Array.isArray(response.data.items)) {
        return { ...response, data: response.data.items };
      }
      return { ...response, data: [] };
    } catch (error) {
      console.error('cropService.getFiltered Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }
};

export default cropService;
