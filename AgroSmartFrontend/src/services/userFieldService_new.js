import api from './api';
import { authService } from './authService';

// User-specific Field API endpoints (using standard API with user context)
export const userFieldService = {
  // GET /api/Field/All (all fields - filtered client-side by user)
  getAll: async () => {
    const response = await api.get('/Field/All');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Field/{id} (specific field)
  getById: async (id) => {
    try {
      const response = await api.get(`/Field/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching field with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST /api/Field (create field)
  create: (fieldData) => {
    const user = authService.getCurrentUser();
    const fieldWithUser = {
      ...fieldData,
      userId: user?.userId
    };
    return api.post('/Field', fieldWithUser);
  },
  
  // PUT /api/Field/{id} (update field)
  update: (id, fieldData) => {
    const user = authService.getCurrentUser();
    const fieldWithUser = {
      ...fieldData,
      userId: user?.userId
    };
    return api.put(`/Field/${id}`, fieldWithUser);
  },
  
  // DELETE /api/Field/{id} (delete field)
  delete: (id) => api.delete(`/Field/${id}`),
  
  // GET /api/Field/dropdown (field dropdown)
  getDropdown: async () => {
    const response = await api.get('/Field/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Field/filter (filter fields)
  filter: (filterParams) => api.get('/Field/filter', { params: filterParams }),
  
  // Helper method to get user's fields only (client-side filtering)
  getUserFields: async (userId) => {
    const response = await userFieldService.getAll();
    const userFields = response.data.filter(field => field.userId === userId || field.farm?.userId === userId);
    return { ...response, data: userFields };
  }
};

export default userFieldService;
