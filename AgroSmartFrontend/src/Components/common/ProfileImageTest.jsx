import React from 'react';
import ProfileImageDisplay from './ProfileImage';
import ProfileImageUpload from './ProfileImageUpload';

const ProfileImageTest = () => {
  // Test user without profile image (should show default)
  const testUserWithoutImage = {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@test.com',
    role: 'Admin',
    profileImage: null
  };

  // Test user with profile image
  const testUserWithImage = {
    id: 2,
    fullName: 'Test User',
    email: 'user@test.com',
    role: 'User',
    profileImage: 'some-profile-image.jpg'
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Profile Image Test</h2>
      
      {/* Test ProfileImageDisplay without image */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">ProfileImageDisplay - Admin without image (should show default)</h3>
        <div className="flex space-x-4">
          <ProfileImageDisplay user={testUserWithoutImage} size="sm" />
          <ProfileImageDisplay user={testUserWithoutImage} size="md" />
          <ProfileImageDisplay user={testUserWithoutImage} size="lg" />
          <ProfileImageDisplay user={testUserWithoutImage} size="xl" />
        </div>
      </div>

      {/* Test ProfileImageDisplay with image */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">ProfileImageDisplay - User with image (should show broken image, then fallback)</h3>
        <div className="flex space-x-4">
          <ProfileImageDisplay user={testUserWithImage} size="sm" />
          <ProfileImageDisplay user={testUserWithImage} size="md" />
          <ProfileImageDisplay user={testUserWithImage} size="lg" />
          <ProfileImageDisplay user={testUserWithImage} size="xl" />
        </div>
      </div>

      {/* Test ProfileImageUpload without image */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">ProfileImageUpload - Admin without image (should show default)</h3>
        <ProfileImageUpload user={testUserWithoutImage} />
      </div>

      {/* Test ProfileImageUpload with image */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">ProfileImageUpload - User with image (should show broken image, then fallback)</h3>
        <ProfileImageUpload user={testUserWithImage} />
      </div>

      {/* Test null user */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">ProfileImageDisplay - Null user (should show default)</h3>
        <ProfileImageDisplay user={null} size="lg" />
      </div>
    </div>
  );
};

export default ProfileImageTest;
