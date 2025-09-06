# Profile Picture Configuration & Troubleshooting

## Environment Configuration

### Required Environment Variables

Add these to your `.env` file:

```env
# API Base URL for backend requests
VITE_API_BASE_URL=https://localhost:7059/api

# Image Base URL for serving images
VITE_IMAGE_BASE_URL=https://localhost:7059
```

### Development vs Production

**Development (localhost):**
```env
VITE_API_BASE_URL=https://localhost:7059/api
VITE_IMAGE_BASE_URL=https://localhost:7059
```

**Production:**
```env
VITE_API_BASE_URL=https://your-production-domain.com/api
VITE_IMAGE_BASE_URL=https://your-production-domain.com
```

## How Profile Pictures Work

### 1. Upload Process
1. User selects image file
2. File is validated (type, size)
3. FormData is created with the file
4. POST request to `/api/User/{id}/UploadProfilePicture`
5. Backend saves image and returns relative path (e.g., `Images/abc.jpg`)
6. Frontend constructs full URL for display

### 2. Image URL Construction

The `getImageUrl()` utility function constructs the full image URL:

```javascript
// Input: "Images/abc.jpg"
// Output: "https://localhost:7059/Images/abc.jpg"
```

### 3. Display Process
1. ProfilePicture component receives user object
2. Extracts `user.profileImage` (relative path)
3. Constructs full URL using `getImageUrl()`
4. Displays image with fallback handling

## Troubleshooting

### Profile Pictures Not Showing

#### 1. Check Environment Variables
Open browser developer tools and check console for debug logs:
```javascript
// Look for this debug output:
Profile Image Debug: {
  userProfileImage: "Images/abc.jpg",
  constructedImageUrl: "https://localhost:7059/Images/abc.jpg",
  imageBaseUrl: "https://localhost:7059",
  apiBaseUrl: "https://localhost:7059/api"
}
```

#### 2. Check Image URL
- Open the constructed image URL directly in browser
- Should see the image if backend is serving correctly
- Example: `https://localhost:7059/Images/abc.jpg`

#### 3. Common Issues

**Issue: 404 Not Found**
- Backend not serving images correctly
- Check if backend has static file middleware configured
- Verify image exists in backend storage

**Issue: CORS Error**
- Backend CORS policy blocking image requests
- Add image domain to CORS allowed origins

**Issue: Wrong URL Construction**
- Check environment variables are loaded
- Restart dev server after changing .env
- Verify no extra slashes in URLs

**Issue: Image Path Format**
- Backend should return relative path: `Images/abc.jpg`
- Not full URL: `https://localhost:7059/Images/abc.jpg`

### 4. Verify Backend Configuration

Your backend should:
1. Accept multipart/form-data uploads
2. Save images to `/Images/` directory
3. Return relative path in response
4. Serve static files from root URL
5. Allow CORS for image requests

### 5. Test Image Serving

Test if backend serves images correctly:
```bash
# Upload an image via API
curl -X POST https://localhost:7059/api/User/1/UploadProfilePicture \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "File=@test-image.jpg"

# Response should be:
{
  "message": "Profile picture uploaded successfully",
  "imageUrl": "Images/13dd081e-746d-403a-aa6f-e82a0f5df08b.jpg"
}

# Then test direct access:
curl https://localhost:7059/Images/13dd081e-746d-403a-aa6f-e82a0f5df08b.jpg
```

## File Structure

```
Frontend:
├── .env                                    # Environment variables
├── src/
│   ├── utils/
│   │   └── imageUtils.js                   # Image URL utilities
│   ├── Components/
│   │   └── common/
│   │       └── ProfilePicture.jsx          # Reusable component
│   └── services/
│       └── userService.js                  # API calls

Backend (should have):
├── Images/                                 # Static image storage
├── Controllers/
│   └── UserController.cs                   # Upload/delete endpoints
└── Startup.cs                             # Static file middleware
```

## Component Usage

### Basic Usage
```jsx
import ProfilePicture from '../common/ProfilePicture';

<ProfilePicture 
  user={user} 
  onUserUpdate={updateUser} 
  size="lg" 
/>
```

### Available Sizes
- `sm`: 48px (w-12 h-12)
- `md`: 64px (w-16 h-16) 
- `lg`: 80px (w-20 h-20)
- `xl`: 96px (w-24 h-24)

### Features
- ✅ File validation (JPEG, PNG, GIF, 5MB max)
- ✅ Loading states with spinner
- ✅ Error handling with fallback avatar
- ✅ User initials as fallback
- ✅ Toast notifications
- ✅ Responsive design
- ✅ ARIA accessibility

## Debugging Checklist

When profile pictures aren't working:

1. ✅ Check browser console for debug logs
2. ✅ Verify environment variables are correct
3. ✅ Test image URL directly in browser
4. ✅ Check network tab for failed requests
5. ✅ Verify backend is running and accessible
6. ✅ Check backend static file configuration
7. ✅ Test API upload endpoint with curl/Postman
8. ✅ Verify CORS configuration
9. ✅ Check user object has profileImage property
10. ✅ Restart dev server after .env changes
