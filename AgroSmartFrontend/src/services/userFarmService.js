import api from './api';
import { authService } from './authService';

// User-specific Farm API endpoints
export const userFarmService = {
  // GET user's farms only
  getMyFarms: async () => {
    const response = await api.get('/Farm/user/my-farms');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET specific farm owned by user
  getMyFarmById: async (id) => {
    try {
      const response = await api.get(`/Farm/user/my-farms/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching user farm with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST create farm for current user
  createMyFarm: (farmData) => {
    const user = authService.getCurrentUser();
    const farmWithUser = {
      ...farmData,
      userId: user?.userId,
      ownerId: user?.userId
    };
    return api.post('/Farm/user', farmWithUser);
  },
  
  // PUT update user's farm
  updateMyFarm: (id, farmData) => {
    const user = authService.getCurrentUser();
    const farmWithUser = {
      ...farmData,
      userId: user?.userId,
      ownerId: user?.userId
    };
    return api.put(`/Farm/user/${id}`, farmWithUser);
  },
  
  // DELETE user's farm
  deleteMyFarm: (id) => api.delete(`/Farm/user/${id}`),
  
  // GET user's farms dropdown
  getMyFarmsDropdown: async () => {
    const response = await api.get('/Farm/user/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET user's farms with filters
  getMyFarmsFiltered: async (filters) => {
    console.log('userFarmService.getMyFarmsFiltered called with filters:', filters);
    
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
      }
      
      const response = await api.get(`/Farm/user/filter?${params.toString()}`);
      
      // Ensure always returns array
      if (Array.isArray(response.data)) return response;
      if (response.data && Array.isArray(response.data.items)) {
        return { ...response, data: response.data.items };
      }
      return { ...response, data: [] };
      
    } catch (error) {
      console.error('Error filtering user farms:', error);
      throw error;
    }
  },

  // GET user's farm statistics
  getMyFarmStats: async () => {
    try {
      const response = await api.get('/Farm/user/stats');
      return response;
    } catch (error) {
      console.error('Error fetching user farm stats:', error);
      throw error;
    }
  }
};

export default userFarmService;
