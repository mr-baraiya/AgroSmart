// API Error Handler Utility
export class ApiError extends Error {
  constructor(message, status, isServerDown = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isServerDown = isServerDown;
  }
}

export const handleApiError = (error) => {
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
    throw new ApiError(
      'Server is currently unavailable. Please check your connection and try again.',
      0,
      true
    );
  }

  // Handle other API errors
  if (error?.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message || 'An error occurred';
    throw new ApiError(message, status, false);
  }

  throw new ApiError(error.message || 'An unexpected error occurred', 500, false);
};

// Enhanced fetch wrapper with retry logic
export const apiRequest = async (url, options = {}, retries = 3) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    timeout: 10000,
    ...options,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), defaultOptions.timeout);

      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500 && attempt < retries) {
          // Retry on server errors
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          false
        );
      }

      return response;
    } catch (error) {
      if (attempt === retries) {
        handleApiError(error);
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }
};

// Wrapper for common API operations
export const apiService = {
  get: (url, options = {}) => apiRequest(url, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (url, data, options = {}) => apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (url, options = {}) => apiRequest(url, { ...options, method: 'DELETE' }),
};
