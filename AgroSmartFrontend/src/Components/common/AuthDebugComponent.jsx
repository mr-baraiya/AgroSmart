import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';

const AuthDebugComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const [apiTestResult, setApiTestResult] = useState('Testing...');

  useEffect(() => {
    console.log('=== Authentication Debug ===');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('User object:', user);
    console.log('User ID:', user?.userId);
    console.log('AuthToken in localStorage:', localStorage.getItem('authToken'));
    console.log('User in localStorage:', localStorage.getItem('user'));
    
    // Test API call
    const testApiCall = async () => {
      try {
        const api = await import('../../services/api');
        console.log('API baseURL:', api.default.defaults.baseURL);
        console.log('API headers:', api.default.defaults.headers);
        
        const response = await api.default.get('/Auth/profile');
        console.log('✅ Profile API call successful:', response.data);
        setApiTestResult('✅ API call successful');
      } catch (error) {
        console.error('❌ Profile API call failed:', error.response?.status, error.response?.data);
        setApiTestResult(`❌ API call failed: ${error.response?.status} ${error.response?.statusText}`);
      }
    };
    
    testApiCall();
  }, [user, isAuthenticated]);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-2">🔍 Authentication Debug</h3>
      <div className="text-sm space-y-1">
        <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User ID:</strong> {user?.userId || 'None'}</p>
        <p><strong>User Email:</strong> {user?.email || 'None'}</p>
        <p><strong>User Role:</strong> {user?.role || 'None'}</p>
        <p><strong>Token exists:</strong> {localStorage.getItem('authToken') ? '✅ Yes' : '❌ No'}</p>
        <p><strong>API Test:</strong> {apiTestResult}</p>
      </div>
    </div>
  );
};

export default AuthDebugComponent;
