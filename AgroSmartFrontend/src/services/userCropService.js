import api from './api';
import { authService } from './authService';

// User-specific Crop API endpoints
export const userCropService = {
  // GET user's crops only
  getMyCrops: async () => {
    const response = await api.get('/Crop/user/my-crops');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET specific crop owned by user
  getMyCropById: async (id) => {
    try {
      const response = await api.get(`/Crop/user/my-crops/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching user crop with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST create crop for current user
  createMyCrop: (cropData) => {
    const user = authService.getCurrentUser();
    const cropWithUser = {
      ...cropData,
      userId: user?.userId,
      ownerId: user?.userId
    };
    return api.post('/Crop/user', cropWithUser);
  },
  
  // PUT update user's crop
  updateMyCrop: (id, cropData) => {
    const user = authService.getCurrentUser();
    const cropWithUser = {
      ...cropData,
      userId: user?.userId,
      ownerId: user?.userId
    };
    return api.put(`/Crop/user/${id}`, cropWithUser);
  },
  
  // DELETE user's crop
  deleteMyCrop: (id) => api.delete(`/Crop/user/${id}`),
  
  // GET user's crops dropdown
  getMyCropsDropdown: async () => {
    const response = await api.get('/Crop/user/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET crops by user's field
  getMyCropsByField: async (fieldId) => {
    const response = await api.get(`/Crop/user/field/${fieldId}`);
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET crops by user's farm
  getMyCropsByFarm: async (farmId) => {
    const response = await api.get(`/Crop/user/farm/${farmId}`);
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET user's crops with filters
  getMyCropsFiltered: async (filters) => {
    console.log('userCropService.getMyCropsFiltered called with filters:', filters);
    
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
      }
      
      const response = await api.get(`/Crop/user/filter?${params.toString()}`);
      
      if (Array.isArray(response.data)) return response;
      if (response.data && Array.isArray(response.data.items)) {
        return { ...response, data: response.data.items };
      }
      return { ...response, data: [] };
      
    } catch (error) {
      console.error('Error filtering user crops:', error);
      throw error;
    }
  },

  // GET user's crop statistics
  getMyCropStats: async () => {
    try {
      const response = await api.get('/Crop/user/stats');
      return response;
    } catch (error) {
      console.error('Error fetching user crop stats:', error);
      throw error;
    }
  },

  // GET crop growth stages for user's crops
  getMyCropGrowthStages: async (cropId) => {
    try {
      const response = await api.get(`/Crop/user/${cropId}/growth-stages`);
      return response;
    } catch (error) {
      console.error('Error fetching user crop growth stages:', error);
      throw error;
    }
  }
};

export default userCropService;
