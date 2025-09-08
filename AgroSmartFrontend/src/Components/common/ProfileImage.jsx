import React from 'react';
import { User } from 'lucide-react';
import defaultProfileImage from '../../assets/default-profile.png';

const ProfileImageDisplay = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  // Construct image URL
  const imageUrl = user?.profileImage 
    ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${user.profileImage}`
    : defaultProfileImage;

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
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 ${className}`}>
      {/* Profile Image */}
      <img
        src={imageUrl}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={(e) => {
          // If the user has a custom profile image that fails, try default image
          if (user?.profileImage && e.target.src !== defaultProfileImage) {
            e.target.src = defaultProfileImage;
          } else {
            // If default image also fails, show initials
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
      {/* Fallback initials (hidden by default) */}
      <div 
        className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center"
        style={{ display: 'none' }}
      >
        {userInitials ? (
          <span className={`text-white font-bold ${
            size === 'sm' ? 'text-xs' : 
            size === 'md' ? 'text-sm' : 
            size === 'lg' ? 'text-base' : 'text-lg'
          }`}>
            {userInitials}
          </span>
        ) : (
          <User className={`${iconSizes[size]} text-white`} />
        )}
      </div>
    </div>
  );
};

export default ProfileImageDisplay;
