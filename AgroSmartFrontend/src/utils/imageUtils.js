/**
 * Utility functions for handling image URLs in the application
 */

/**
 * Constructs the full image URL from a relative path
 * @param {string} imagePath - The relative image path (e.g., "Images/abc.jpg")
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If imagePath already contains http/https, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get base URL from environment variables
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://localhost:7059';
  
  // Ensure proper URL construction
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

/**
 * Validates if an image URL is accessible
 * @param {string} imageUrl - The image URL to validate
 * @returns {Promise<boolean>} - Promise that resolves to true if image is accessible
 */
export const validateImageUrl = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

/**
 * Gets the default avatar URL or generates initials
 * @param {Object} user - User object
 * @returns {string} - Default avatar URL or user initials
 */
export const getDefaultAvatar = (user) => {
  if (!user) return '';
  
  // You could implement a service like Gravatar here
  // For now, we'll return initials
  const fullName = user.fullName || user.name || 'User';
  const initials = fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return initials;
};

export default {
  getImageUrl,
  validateImageUrl,
  getDefaultAvatar
};
