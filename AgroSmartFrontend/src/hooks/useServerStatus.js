import { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config.js';

const useServerStatus = () => {
  const [isServerOnline, setIsServerOnline] = useState(null);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  const checkServerStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`${API_BASE_URL}/Farm/All`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.status < 500) {
        if (!isServerOnline) {
          console.log('🟢 SERVER CONNECTED: Connection restored successfully');
        }
        setIsServerOnline(true);
        setRetryCount(0);
      } else {
        if (isServerOnline !== false) {
          console.log('🔴 SERVER DISCONNECTED: Server returned error status:', response.status);
        }
        setIsServerOnline(false);
      }
    } catch (error) {
      const isConnectionError = 
        error.name === 'AbortError' ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network Error');
        
      if (isConnectionError && !isInitialCheck) {
        if (isServerOnline !== false) {
          console.log('🔴 SERVER DISCONNECTED: Network connection error -', error.message);
        }
        setIsServerOnline(false);
      }
    }
    
    setLastChecked(new Date());
    if (isInitialCheck) {
      setIsInitialCheck(false);
    }
  }, [isInitialCheck]);

  const handleApiError = useCallback((error) => {
    const serverDownIndicators = [
      'Network Error', 'fetch failed', 'Failed to fetch',
      'ERR_NETWORK', 'ERR_CONNECTION_REFUSED'
    ];

    const errorMessage = error?.message || '';
    const isServerDown = serverDownIndicators.some(indicator => 
      errorMessage.includes(indicator)
    );

    if (isServerDown) {
      setIsServerOnline(false);
      setRetryCount(prev => prev + 1);
    }

    return isServerDown;
  }, []);

  const retryConnection = useCallback(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isServerOnline && !isInitialCheck) {
        checkServerStatus();
      }
    }, 120000); // Check every 2 minutes when server is down (less aggressive)

    return () => clearInterval(interval);
  }, [isServerOnline, isInitialCheck, checkServerStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkServerStatus();
    }, 3000); // 3 second delay to avoid startup issues

    return () => clearTimeout(timer);
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
