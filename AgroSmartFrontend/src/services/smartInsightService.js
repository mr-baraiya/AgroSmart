import api from './api';

// Smart Insight API endpoints
export const smartInsightService = {
  // GET /api/SmartInsight/All with pagination and filters
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.status) {
        const isResolved = params.status === 'Resolved';
        queryParams.append('isResolved', isResolved);
      }
      
      const url = queryParams.toString() ? `/SmartInsight/All?${queryParams}` : '/SmartInsight/All';
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // GET /api/SmartInsight/{id}
  getById: (id) => api.get(`/SmartInsight/${id}`),
  
  // POST /api/SmartInsight
  create: (insightData) => api.post('/SmartInsight', insightData),
  
  // PUT /api/SmartInsight/{id}
  update: (id, insightData) => api.put(`/SmartInsight/${id}`, insightData),
  
  // PUT /api/SmartInsight/{id}/resolve
  toggleResolve: async (id) => {
    try {
      const response = await api.put(`/SmartInsight/${id}/resolve`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE /api/SmartInsight/{id}
  delete: (id) => api.delete(`/SmartInsight/${id}`),
  
  // GET /api/SmartInsight/Filter
  getFiltered: (filters) => api.get('/SmartInsight/Filter', { params: filters }),

  // GET /api/SmartInsight/analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/SmartInsight/analytics');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export insights data
  export: async (format = 'csv', filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.status) {
        const isResolved = filters.status === 'Resolved';
        queryParams.append('isResolved', isResolved);
      }
      
      const response = await api.get(`/SmartInsight/export?${queryParams}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk operations
  bulkDelete: async (ids) => {
    try {
      const response = await api.post('/SmartInsight/bulk-delete', { ids });
      return response;
    } catch (error) {
      throw error;
    }
  },

  bulkResolve: async (ids) => {
    try {
      const response = await api.post('/SmartInsight/bulk-resolve', { ids });
      return response;
    } catch (error) {
      throw error;
    }
  },

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
