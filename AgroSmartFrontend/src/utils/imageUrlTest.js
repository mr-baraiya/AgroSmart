// Test the image URL construction
import { getImageUrl } from '../utils/imageUtils';

// Test cases
const testImagePath = "Images/13dd081e-746d-403a-aa6f-e82a0f5df08b.jpg";

console.log("Image URL Test Results:");
console.log("Input path:", testImagePath);
console.log("Constructed URL:", getImageUrl(testImagePath));
console.log("Expected URL: https://localhost:7059/Images/13dd081e-746d-403a-aa6f-e82a0f5df08b.jpg");

// Environment variables
console.log("Environment Variables:");
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("VITE_IMAGE_BASE_URL:", import.meta.env.VITE_IMAGE_BASE_URL);

// Test with different formats
const testCases = [
  "Images/abc.jpg",
  "/Images/abc.jpg", 
  "https://localhost:7059/Images/abc.jpg",
  null,
  undefined,
  ""
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`, testCase, "->", getImageUrl(testCase));
});

export default null;
