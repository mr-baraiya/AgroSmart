import React, { useRef, useState } from 'react';
import { Camera, Trash2, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthProvider';

const ProfileImageUpload = ({ user, size = 'lg' }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const buttonSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
    xl: 'w-9 h-9'
  };

  const buttonIconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
    xl: 'w-4.5 h-4.5'
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('File', file);

      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🔐 Upload request details:', {
        userId: user.userId,
        userIdType: typeof user.userId,
        apiUrl: `${import.meta.env.VITE_API_BASE_URL}/User/${user.userId}/UploadProfilePicture`,
        hasToken: !!token,
        tokenStart: token ? token.substring(0, 20) + '...' : 'none',
        fileSize: file.size,
        fileName: file.name
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/User/${user.userId}/UploadProfilePicture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Upload error response:', response.status, errorData);
        throw new Error(`Failed to upload image: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload success:', result);
      
      // Update user with new profile image
      const updatedUser = { ...user, profileImage: result.imageUrl };
      updateUser(updatedUser);
      
      toast.success('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!user.profileImage) {
      toast.error('No profile picture to delete');
      return;
    }

    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/User/${user.userId}/DeleteProfilePicture`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Delete error response:', response.status, errorData);
        throw new Error(`Failed to delete image: ${response.status}`);
      }
      
      console.log('Delete success');
      
      // Update user to remove profile image
      const updatedUser = { ...user, profileImage: null };
      updateUser(updatedUser);
      
      toast.success('Profile picture deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete profile picture');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Construct image URL
  const imageUrl = user?.profileImage 
    ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${user.profileImage}`
    : null;

  // Get user initials for fallback
  const getUserInitials = (user) => {
    if (user?.fullName) {
      return user.fullName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.name) {
      return user.name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  const userInitials = getUserInitials(user);

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100`}>
        {/* Profile Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            <span className={`text-white font-bold ${
              size === 'sm' ? 'text-xs' : 
              size === 'md' ? 'text-sm' : 
              size === 'lg' ? 'text-lg' : 'text-xl'
            }`}>
              {userInitials}
            </span>
          </div>
        )}
      </div>
      
      {/* Upload/Delete Buttons */}
      <div className="absolute -bottom-2 -right-2 flex gap-1">
        <button
          onClick={triggerFileInput}
          disabled={loading}
          className={`${buttonSizes[size]} bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50`}
          title="Upload new profile picture"
        >
          {loading ? (
            <div className={`${buttonIconSizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
          ) : (
            <Camera className={buttonIconSizes[size]} />
          )}
        </button>
        
        {user?.profileImage && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`${buttonSizes[size]} bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50`}
            title="Delete profile picture"
          >
            <Trash2 className={buttonIconSizes[size]} />
          </button>
        )}
      </div>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUpload;
