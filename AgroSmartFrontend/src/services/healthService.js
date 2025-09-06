import api from './api';

// Admin-specific Health API endpoints
export const healthService = {
  // GET /api/Health
  getHealth: async () => {
    try {
      const response = await api.get('/Health');
      return response;
    } catch (error) {
      console.error('Error fetching health status:', error);
      throw error;
    }
  }
};

export default healthService;
