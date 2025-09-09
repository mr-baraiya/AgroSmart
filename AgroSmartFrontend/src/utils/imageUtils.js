/**
 * Utility functions for handling image URLs in the application
 */
import defaultProfileImage from '../assets/default-profile.png';

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
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://agrosmart-backend-7xdp.onrender.com';
  
  // Ensure proper URL construction
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

/**
 * Get the profile image URL with proper fallback
 * @param {Object} user - User object
 * @returns {string} - Profile image URL or default image
 */
export const getProfileImageUrl = (user) => {
  // Handle different possible property names
  const profileImage = user?.profilePicture || user?.profileImage || user?.image;
  
  if (!profileImage) {
    return defaultProfileImage;
  }

  // If it's already a full URL, return as is
  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
    return profileImage;
  }

  // Get base URL from environment variables
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://agrosmart-backend-7xdp.onrender.com';
  
  // Clean up paths
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = profileImage.startsWith('/') ? profileImage : `/${profileImage}`;
  
  // Add cache-busting parameter to force reload of updated images
  const timestamp = Date.now();
  return `${cleanBaseUrl}${cleanPath}?t=${timestamp}`;
};

/**
 * Get user initials for fallback display
 * @param {Object} user - User object
 * @returns {string} - User initials
 */
export const getUserInitials = (user) => {
  if (user?.fullName) {
    return user.fullName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  }
  if (user?.name) {
    return user.name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  }
  if (user?.username) {
    return user.username.charAt(0).toUpperCase();
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return 'U';
};

/**
 * Handle image load error with fallback
 * @param {Event} e - Error event
 * @param {string} fallbackSrc - Fallback image source
 */
export const handleImageError = (e, fallbackSrc = defaultProfileImage) => {
  if (e.target.src !== fallbackSrc) {
    e.target.src = fallbackSrc;
  }
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
  getDefaultAvatar,
  getProfileImageUrl,
  getUserInitials,
  handleImageError
};
