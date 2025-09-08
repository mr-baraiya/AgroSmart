import React from 'react';

const AdminProfileDebug = ({ user }) => {
  console.log('🔍 Admin User Debug:', {
    user,
    hasUser: !!user,
    userId: user?.userId,
    profileImage: user?.profileImage,
    fullName: user?.fullName,
    role: user?.role
  });

  // Test image URL construction
  const testImageUrl = user?.profileImage 
    ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${user.profileImage}`
    : '/default-profile.png';

  console.log('🖼️ Image URL Test:', {
    hasProfileImage: !!user?.profileImage,
    profileImageValue: user?.profileImage,
    VITE_IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
    constructedImageUrl: testImageUrl,
    defaultImagePath: '/default-profile.png'
  });

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔍 Admin Profile Debug</h3>
      <div className="space-y-2 text-sm">
        <p><strong>User exists:</strong> {user ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User ID:</strong> {user?.userId || 'Not set'}</p>
        <p><strong>Full Name:</strong> {user?.fullName || 'Not set'}</p>
        <p><strong>Role:</strong> {user?.role || 'Not set'}</p>
        <p><strong>Profile Image:</strong> {user?.profileImage || 'Not set'}</p>
        <p><strong>Expected Image URL:</strong> {testImageUrl}</p>
        <p><strong>Environment Base URL:</strong> {import.meta.env.VITE_IMAGE_BASE_URL || 'Not set'}</p>
        
        <div className="mt-4">
          <p><strong>Test Image Display:</strong></p>
          <img 
            src={testImageUrl} 
            alt="Profile test" 
            className="w-16 h-16 rounded-full border-2 border-gray-200"
            onError={(e) => {
              console.error('❌ Image failed to load:', testImageUrl);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', testImageUrl);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDebug;
