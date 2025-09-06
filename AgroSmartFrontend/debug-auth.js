// Debug script to check authentication status
console.log('=== Authentication Debug ===');
console.log('Current URL:', window.location.href);
console.log('AuthToken in localStorage:', localStorage.getItem('authToken'));
console.log('User in localStorage:', localStorage.getItem('user'));

// Check if user object exists and has required properties
const userStr = localStorage.getItem('user');
if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('Parsed user object:', user);
    console.log('User ID:', user.userId);
    console.log('User role:', user.role);
    console.log('User email:', user.email);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }
} else {
  console.log('No user found in localStorage');
}

// Check axios default headers
import axios from 'axios';
console.log('Axios default Authorization header:', axios.defaults.headers.common['Authorization']);

// Test API call with current auth
import api from './services/api.js';
api.get('/Auth/profile')
  .then(response => {
    console.log('Profile API call successful:', response.data);
  })
  .catch(error => {
    console.error('Profile API call failed:', error.response?.status, error.response?.data);
  });
