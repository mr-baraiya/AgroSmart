import api from './api';
import { authService } from './authService';

// User-specific Field API endpoints
export const userFieldService = {
  // GET user's fields only
  getMyFields: async () => {
    const response = await api.get('/Field/user/my-fields');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET specific field owned by user
  getMyFieldById: async (id) => {
    try {
      const response = await api.get(`/Field/user/my-fields/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching user field with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST create field for current user
  createMyField: (fieldData) => {
    const user = authService.getCurrentUser();
    const fieldWithUser = {
      ...fieldData,
      userId: user?.userId,
      ownerId: user?.userId
    };
    return api.post('/Field/user', fieldWithUser);
  },
  
  // PUT update user's field
  updateMyField: (id, fieldData) => {
    const user = authService.getCurrentUser();
    const fieldWithUser = {
      ...fieldData,
      userId: user?.userId,
      ownerId: user?.userId
    };
    return api.put(`/Field/user/${id}`, fieldWithUser);
  },
  
  // DELETE user's field
  deleteMyField: (id) => api.delete(`/Field/user/${id}`),
  
  // GET user's fields dropdown
  getMyFieldsDropdown: async () => {
    const response = await api.get('/Field/user/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET fields by user's farm
  getMyFieldsByFarm: async (farmId) => {
    const response = await api.get(`/Field/user/farm/${farmId}`);
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET user's fields with filters
  getMyFieldsFiltered: async (filters) => {
    console.log('userFieldService.getMyFieldsFiltered called with filters:', filters);
    
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
      }
      
      const response = await api.get(`/Field/user/filter?${params.toString()}`);
      
      if (Array.isArray(response.data)) return response;
      if (response.data && Array.isArray(response.data.items)) {
        return { ...response, data: response.data.items };
      }
      return { ...response, data: [] };
      
    } catch (error) {
      console.error('Error filtering user fields:', error);
      throw error;
    }
  },

  // GET user's field statistics
  getMyFieldStats: async () => {
    try {
      const response = await api.get('/Field/user/stats');
      return response;
    } catch (error) {
      console.error('Error fetching user field stats:', error);
      throw error;
    }
  }
};

export default userFieldService;
