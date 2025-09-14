import axios from 'axios';
import API_BASE_URL from '../config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding auth tokens (if needed)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Auth token added to request:', config.url);
    } else {
      // Only warn for protected endpoints that likely need authentication
      const protectedEndpoints = ['/User/', '/Admin/', '/Farm/', '/Field/', '/Crop/', '/Schedule/', '/SmartInsight/'];
      const needsAuth = protectedEndpoints.some(endpoint => config.url?.includes(endpoint));
      
      if (needsAuth && !config.url?.includes('CountAllUsers') && !config.url?.includes('TotalAcres')) {
        console.warn('⚠️ No auth token found for protected request:', config.url);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    console.error('🚨 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      console.warn('🔒 Unauthorized - clearing auth data');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.warn('🚫 Forbidden - check permissions and auth token');
    }
    return Promise.reject(error);
  }
);

export default api;
