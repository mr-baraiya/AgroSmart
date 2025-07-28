import api from './api';

// User API endpoints
export const userService = {
  // GET /api/User/All
  getAll: () => api.get('/User/All'),
  
  // GET /api/User/{id}
  getById: (id) => api.get(`/User/${id}`),
  
  // PUT /api/User/{id}
  update: (id, userData) => api.put(`/User/${id}`, userData),
  
  // DELETE /api/User/{id}
  delete: (id) => api.delete(`/User/${id}`),
  
  // GET /api/User/Filter
  getFiltered: (filters) => api.get('/User/Filter', { params: filters }),
  
  // POST /api/User/Login
  login: (credentials) => api.post('/User/Login', credentials),
  
  // POST /api/User/Register
  register: (userData) => api.post('/User/Register', userData),
  
  // POST /api/User/ChangePassword
  changePassword: (passwordData) => api.post('/User/ChangePassword', passwordData),

  // Helper methods for authentication
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default userService;
