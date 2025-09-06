import api from './api';
import { authService } from './authService';

// User-specific Farm API endpoints (using standard API with user context)
export const userFarmService = {
  // GET /api/Farm/All (all farms - filtered client-side by user)
  getAll: async () => {
    const response = await api.get('/Farm/All');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Farm/{id} (specific farm)
  getById: async (id) => {
    try {
      const response = await api.get(`/Farm/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching farm with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST /api/Farm (create farm)
  create: (farmData) => {
    const user = authService.getCurrentUser();
    const farmWithUser = {
      ...farmData,
      userId: user?.userId
    };
    return api.post('/Farm', farmWithUser);
  },
  
  // PUT /api/Farm/{id} (update farm)
  update: (id, farmData) => {
    const user = authService.getCurrentUser();
    const farmWithUser = {
      ...farmData,
      userId: user?.userId
    };
    return api.put(`/Farm/${id}`, farmWithUser);
  },
  
  // DELETE /api/Farm/{id} (delete farm)
  delete: (id) => api.delete(`/Farm/${id}`),
  
  // GET /api/Farm/dropdown (farm dropdown)
  getDropdown: async () => {
    const response = await api.get('/Farm/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Farm/filter (filter farms)
  filter: (filterParams) => api.get('/Farm/filter', { params: filterParams }),
  
  // Helper method to get user's farms only (client-side filtering)
  getUserFarms: async (userId) => {
    const response = await userFarmService.getAll();
    const userFarms = response.data.filter(farm => farm.userId === userId);
    return { ...response, data: userFarms };
  }
};

export default userFarmService;
