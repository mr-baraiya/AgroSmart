import React from 'react';
import { AlertTriangle, Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';

const ServerStatusBanner = ({ 
  isServerOnline, 
  isInitialCheck,
  lastChecked, 
  retryCount, 
  onRetry 
}) => {
  // Don't show banner during initial check or when server is online
  if (isInitialCheck || isServerOnline) {
    return null;
  }

  const formatLastChecked = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5" />
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Server Connection Lost</div>
              <div className="text-sm opacity-90">
                Unable to connect to the backend server. Please check your connection.
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm opacity-90 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Last checked: {formatLastChecked(lastChecked)}
            </div>
            
            {retryCount > 0 && (
              <div className="text-sm opacity-90">
                Retry attempts: {retryCount}
              </div>
            )}
            
            <button
              onClick={onRetry}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusBanner;
