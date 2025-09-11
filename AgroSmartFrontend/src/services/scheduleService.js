import api from './api';

// Schedule API endpoints
export const scheduleService = {
  // GET /api/Schedule/All
  getAll: () => api.get('/Schedule/All'),
  
  // GET /api/Schedule/{id}
  getById: (id) => api.get(`/Schedule/${id}`),
  
  // POST /api/Schedule
  create: (scheduleData) => api.post('/Schedule', scheduleData),
  
  // PUT /api/Schedule/{id}
  update: (id, scheduleData) => api.put(`/Schedule/${id}`, scheduleData),
  
  // DELETE /api/Schedule/{id}
  delete: (id) => api.delete(`/Schedule/${id}`),
  
  // GET /api/Schedule/Filter
  getFiltered: (filters) => api.get('/Schedule/Filter', { params: filters }),

  // Helper methods for schedule-specific operations
  getTodaySchedule: async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await api.get('/Schedule/Filter', { 
      params: { date: today } 
    });
    return response.data || [];
  },

  getUpcomingSchedule: async (days = 7) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const response = await api.get('/Schedule/Filter', { 
      params: { 
        startDate: today.toISOString().split('T')[0],
        endDate: futureDate.toISOString().split('T')[0]
      } 
    });
    return response.data || [];
  },

  // Mark schedule as completed/incomplete
  markAsCompleted: async (id, isCompleted = true) => {
    try {
      const response = await api.put(`/Schedule/${id}/complete?isCompleted=${isCompleted}`);
      return response;
    } catch (error) {
      console.error(`Error marking schedule ${id} as ${isCompleted ? 'completed' : 'incomplete'}:`, error);
      throw error;
    }
  }
};

export default scheduleService;
