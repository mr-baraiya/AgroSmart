import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle, Server } from 'lucide-react';

const OfflineState = ({ 
  title = "Server Connection Lost",
  message = "Unable to connect to the server. Please check your internet connection and try again.",
  onRetry,
  showRetryButton = true,
  icon: CustomIcon
}) => {
  const Icon = CustomIcon || WifiOff;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="relative mb-6">
        {/* Animated background circle */}
        <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
        
        {/* Icon container */}
        <div className="relative bg-red-50 p-6 rounded-full border-4 border-red-200">
          <Icon className="w-12 h-12 text-red-500" />
        </div>
        
        {/* Warning indicator */}
        <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full">
          <AlertTriangle className="w-4 h-4 text-yellow-800" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
      
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
        {message}
      </p>

      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-5 h-5" />
          Retry Connection
        </button>
      )}

      {/* Additional help text */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Server className="w-4 h-4" />
          Troubleshooting Tips
        </h3>
        <ul className="text-xs text-gray-600 space-y-1 text-left">
          <li>• Check your internet connection</li>
          <li>• Verify the server is running</li>
          <li>• Try refreshing the page</li>
          <li>• Contact support if the issue persists</li>
        </ul>
      </div>
    </div>
  );
};

export default OfflineState;
