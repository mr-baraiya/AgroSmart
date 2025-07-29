import api from './api';

// Farm API endpoints
export const farmService = {
  // GET /api/Farm/All
  getAll: async () => {
    const response = await api.get('/Farm/All');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Farm/{id}
  getById: async (id) => {
    try {
      const response = await api.get(`/Farm/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching farm with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST /api/Farm
  create: (farmData) => api.post('/Farm', farmData),
  
  // PUT /api/Farm/{id}
  update: (id, farmData) => api.put(`/Farm/${id}`, farmData),
  
  // DELETE /api/Farm/{id}
  delete: (id) => api.delete(`/Farm/${id}`),
  
  // GET /api/Farm/dropdown
  getDropdown: async () => {
    const response = await api.get('/Farm/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Farm/filter
  getFiltered: async (filters) => {
    console.log('farmService.getFiltered called with filters:', filters);
    
    try {
      const response = await api.get('/Farm/filter', { params: filters });
      console.log('Farm API Response Status:', response.status);
      console.log('Farm API Response Data:', response.data);
      
      if (Array.isArray(response.data)) return response;
      if (response.data && Array.isArray(response.data.items)) {
        return { ...response, data: response.data.items };
      }
      return { ...response, data: [] };
    } catch (error) {
      console.error('farmService.getFiltered Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }
};

export default farmService;
