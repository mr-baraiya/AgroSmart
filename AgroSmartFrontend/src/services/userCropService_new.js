import api from './api';
import { authService } from './authService';

// User-specific Crop API endpoints (using standard API with user context)
export const userCropService = {
  // GET /api/Crop/All (all crops - filtered client-side by user)
  getAll: async () => {
    const response = await api.get('/Crop/All');
    // Ensure always returns array
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Crop/{id} (specific crop)
  getById: async (id) => {
    try {
      const response = await api.get(`/Crop/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching crop with ID ${id}:`, error);
      throw error;
    }
  },
  
  // POST /api/Crop (create crop)
  create: (cropData) => {
    const user = authService.getCurrentUser();
    const cropWithUser = {
      ...cropData,
      userId: user?.userId
    };
    return api.post('/Crop', cropWithUser);
  },
  
  // PUT /api/Crop/{id} (update crop)
  update: (id, cropData) => {
    const user = authService.getCurrentUser();
    const cropWithUser = {
      ...cropData,
      userId: user?.userId
    };
    return api.put(`/Crop/${id}`, cropWithUser);
  },
  
  // DELETE /api/Crop/{id} (delete crop)
  delete: (id) => api.delete(`/Crop/${id}`),
  
  // GET /api/Crop/dropdown (crop dropdown)
  getDropdown: async () => {
    const response = await api.get('/Crop/dropdown');
    if (Array.isArray(response.data)) return response;
    if (response.data && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    return { ...response, data: [] };
  },
  
  // GET /api/Crop/Filter (filter crops)
  filter: (filterParams) => api.get('/Crop/Filter', { params: filterParams }),
  
  // Helper method to get user's crops only (client-side filtering)
  getUserCrops: async (userId) => {
    const response = await userCropService.getAll();
    const userCrops = response.data.filter(crop => crop.userId === userId);
    return { ...response, data: userCrops };
  }
};

export default userCropService;
