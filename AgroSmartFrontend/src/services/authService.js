import api from './api';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      // Transform credentials to match new API structure
      const loginData = {
        identifier: credentials.email || credentials.identifier,
        password: credentials.password,
        role: credentials.role || 'User' // Default to User if not specified
      };
      
      const response = await api.post('/Auth/Login', loginData);
      
      // Check if user is active
      if (response.data && response.data.isActive === false) {
        const error = new Error('Account is inactive');
        error.isInactive = true;
        error.userData = response.data;
        throw error;
      }
      
      // Store token and user info in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        
        // Create user object from response
        const userInfo = {
          userId: response.data.userId,
          name: response.data.name,
          fullName: response.data.fullName || response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          role: response.data.role,
          profileImage: response.data.profileImage || null,
          isActive: response.data.isActive
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        // Set default authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // 🔔 Notify n8n webhook
        try {
          await fetch("https://agrosmart-4ix0.onrender.com/webhook/agrosmart-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...userInfo,
              loginTime: new Date().toISOString()
            })
          });
          console.log("n8n webhook notified successfully");
        } catch (err) {
          console.error("Failed to notify n8n webhook:", err);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      // Transform userData to match new API structure
      const registerData = {
        userId: 0,
        fullName: userData.fullName || userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash || userData.password, // Handle both field names
        role: 'User', // Always register as User
        phone: userData.phone || '', // Phone should be provided from form
        address: userData.address || '',
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await api.post('/Auth/Register', registerData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Initialize auth (set token in headers if exists)
  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/Auth/request-password-reset', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/Auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Get user profile (if you have a profile endpoint)
  getProfile: async () => {
    try {
      const response = await api.get('/User/Profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/User/Profile', profileData);
      
      // Update user in localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      console.log('🔐 Changing password for user ID:', passwordData.userId);
      
      // Use the correct Auth endpoint for password change
      const response = await api.post('/Auth/ChangePassword', passwordData);
      console.log('✅ Password changed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Password change failed:', error.response?.data?.message || error.message);
      throw error;
    }
  }
};
