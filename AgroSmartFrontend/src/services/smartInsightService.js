import api from './api';

// Smart Insight API endpoints
export const smartInsightService = {
  // GET /api/SmartInsight/All
  getAll: () => api.get('/SmartInsight/All'),
  
  // GET /api/SmartInsight/{id}
  getById: (id) => api.get(`/SmartInsight/${id}`),
  
  // POST /api/SmartInsight
  create: (insightData) => api.post('/SmartInsight', insightData),
  
  // PUT /api/SmartInsight/{id}
  update: (id, insightData) => api.put(`/SmartInsight/${id}`, insightData),
  
  // DELETE /api/SmartInsight/{id}
  delete: (id) => api.delete(`/SmartInsight/${id}`),
  
  // GET /api/SmartInsight/Filter
  getFiltered: (filters) => api.get('/SmartInsight/Filter', { params: filters }),

  // Helper methods for insight-specific operations
  getRecentInsights: async (limit = 10) => {
    const response = await api.get('/SmartInsight/Filter', { 
      params: { limit, sortBy: 'createdDate', sortOrder: 'desc' } 
    });
    // Ensure always returns array
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.items)) return response.data.items;
    return [];
  },

  getInsightsByType: async (type) => {
    const response = await api.get('/SmartInsight/Filter', { 
      params: { type } 
    });
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.items)) return response.data.items;
    return [];
  },

  getInsightsByPriority: async (priority) => {
    const response = await api.get('/SmartInsight/Filter', { 
      params: { priority } 
    });
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.items)) return response.data.items;
    return [];
  }
};

export default smartInsightService;
