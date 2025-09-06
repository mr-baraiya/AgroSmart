// Test image URL validation
import { getImageUrl } from '../utils/imageUtils';

// Test function to validate image URLs
export const testImageUrl = async (imagePath) => {
  console.log('🧪 Testing image path:', imagePath);
  
  const fullUrl = getImageUrl(imagePath);
  console.log('🔗 Full URL constructed:', fullUrl);
  
  try {
    // Test with fetch first
    const response = await fetch(fullUrl, { method: 'HEAD' });
    console.log('📡 Fetch response status:', response.status);
    console.log('📡 Fetch response headers:', response.headers);
    
    if (response.ok) {
      console.log('✅ Image is accessible via fetch');
    } else {
      console.log('❌ Image not accessible via fetch');
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
  
  // Test with Image object
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Image loaded successfully with Image object');
      resolve(true);
    };
    img.onerror = (error) => {
      console.error('❌ Image failed to load with Image object:', error);
      resolve(false);
    };
    img.src = fullUrl;
  });
};

// Auto-test common image paths
if (typeof window !== 'undefined') {
  // Test common paths
  testImageUrl('Images/a17d05de-82a7-478e-bc95-d47a8d76015c.jpg');
  testImageUrl('Images/ff32c828-2c50-4015-9a2f-9551b36317f7.jpg');
}
