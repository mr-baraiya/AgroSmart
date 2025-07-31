import { useState, useEffect, useCallback } from 'react';

const useServerStatus = () => {
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [retryCount, setRetryCount] = useState(0);

  const checkServerStatus = useCallback(async () => {
    try {
      // Try to reach the backend health endpoint or any simple endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/health`, {
        method: 'GET',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsServerOnline(true);
        setRetryCount(0);
      } else {
        setIsServerOnline(false);
      }
    } catch (error) {
      console.error('Server connectivity check failed:', error);
      setIsServerOnline(false);
    }
    
    setLastChecked(new Date());
  }, []);

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
        checkServerStatus();
      }
    }, 10000); // Check every 10 seconds when server is down

    return () => clearInterval(interval);
  }, [isServerOnline, checkServerStatus]);

  // Initial check
  useEffect(() => {
    checkServerStatus();
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
    lastChecked,
    retryCount,
    checkServerStatus,
    handleApiError,
    retryConnection
  };
};

export default useServerStatus;
