import { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config.js';

const useServerStatus = () => {
  const [isServerOnline, setIsServerOnline] = useState(null); // Start with null to indicate "checking"
  const [lastChecked, setLastChecked] = useState(new Date());
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  const checkServerStatus = useCallback(async () => {
    try {
      console.log('🔍 Checking server status at:', API_BASE_URL);
      
      // First try a simple GET request to see if server responds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/Farm/All`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('✅ Server response status:', response.status);
      
      // Consider server online if we get any response (even 401, 403, 404, etc.)
      // Only consider it offline if we can't connect at all
      if (response.status < 500) { // Any 1xx, 2xx, 3xx, 4xx response means server is reachable
        console.log('✅ Server is online (status:', response.status, ')');
        setIsServerOnline(true);
        setRetryCount(0);
      } else {
        console.log('⚠️ Server returned 5xx error:', response.status);
        setIsServerOnline(false);
      }
    } catch (error) {
      console.error('❌ Server connectivity check failed:', error);
      
      // Only set offline if it's actually a connection error
      const isConnectionError = 
        error.name === 'AbortError' ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network Error') ||
        error.message.includes('ERR_NETWORK') ||
        error.message.includes('ERR_CONNECTION_REFUSED');
        
      if (isConnectionError) {
        console.log('❌ Setting server offline due to connection error');
        setIsServerOnline(false);
      } else {
        console.log('⚠️ Non-connection error, keeping server status as online');
        setIsServerOnline(true); // Don't mark offline for other types of errors
      }
    }
    
    setLastChecked(new Date());
    // Only set initial check to false after we have a definitive result
    if (isInitialCheck) {
      setIsInitialCheck(false);
    }
  }, [isInitialCheck]);

  const handleApiError = useCallback((error) => {
    // Check if error indicates server is down
    const serverDownIndicators = [
      'Network Error',
      'fetch failed',
      'Failed to fetch',
      'ERR_NETWORK',
      'ERR_INTERNET_DISCONNECTED',
      'ERR_CONNECTION_REFUSED',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT'
    ];

    const errorMessage = error?.message || error?.toString() || '';
    const isServerDown = serverDownIndicators.some(indicator => 
      errorMessage.includes(indicator)
    ) || error?.code === 'NETWORK_ERROR' || !navigator.onLine;

    if (isServerDown) {
      setIsServerOnline(false);
      setRetryCount(prev => prev + 1);
    }

    return isServerDown;
  }, []);

  const retryConnection = useCallback(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isServerOnline) {
        console.log('🔄 Retrying server connection check...');
        checkServerStatus();
      }
    }, 30000); // Check every 30 seconds when server is down (less aggressive)

    return () => clearInterval(interval);
  }, [isServerOnline, checkServerStatus]);

  // Initial check - but delay it slightly to let the app initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      checkServerStatus();
    }, 100); // Reduced delay to 100ms

    return () => clearTimeout(timer);
  }, [checkServerStatus]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsServerOnline(true);
      checkServerStatus();
    };

    const handleOffline = () => {
      setIsServerOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkServerStatus]);

  return {
    isServerOnline,
    isInitialCheck,
    lastChecked,
    retryCount,
    checkServerStatus,
    handleApiError,
    retryConnection
  };
};

export default useServerStatus;
