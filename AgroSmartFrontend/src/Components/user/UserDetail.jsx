import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, UserCheck, UserX, Shield, User, Mail, Phone, Calendar, Clock, Camera, Upload } from 'lucide-react';
import { adminUserService } from '../../services';
import { useServerStatusContext } from '../../contexts/ServerStatusProvider';
import OfflineState from '../common/OfflineState';
import CustomAlert from '../common/CustomAlert';
import { toast } from 'react-toastify';
import { getProfileImageUrl, getUserInitials, handleImageError } from '../../utils/imageUtils';

const UserDetail = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isServerOnline, isInitialCheck, handleApiError } = useServerStatusContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isServerError, setIsServerError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  // Show alert function
  const showAlert = (type, title, message, onConfirm = null, onCancel = null) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      onCancel
    });
  };

  // Close alert function
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (isServerOnline && !isInitialCheck && userId) {
      fetchUserData();
    }
  }, [isServerOnline, isInitialCheck, userId]);

  const fetchUserData = async () => {
    setLoading(true);
    setIsServerError(false);
    
    try {
      const response = await adminUserService.getUserById(userId);
      if (response && response.data) {
        console.log('👤 User data fetched:', response.data);
        console.log('🖼️ Profile picture field:', response.data.profilePicture);
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const errorHandled = handleApiError(error);
      
      if (!errorHandled) {
        toast.error('Failed to load user data. Please try again.');
        navigate('/dashboard/users');
      } else {
        setIsServerError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/users/edit/${userId}`);
  };

  const handleBack = () => {
    navigate('/dashboard/users');
  };

  const handleSoftDelete = async () => {
    showAlert(
      'confirm',
      'Deactivate User',
      `Are you sure you want to deactivate "${user.fullName}"? This will set the user as inactive but preserve their data.`,
      async () => {
        try {
          await adminUserService.softDeleteUser(userId);
          closeAlert();
          navigate('/dashboard/users', {
            state: { message: `User "${user.fullName}" has been deactivated successfully!`, type: 'success' }
          });
        } catch (error) {
          console.error('Error deactivating user:', error);
          toast.error(`Failed to deactivate user "${user.fullName}". Please try again.`);
        }
      }
    );
  };

  const handleHardDelete = async () => {
    showAlert(
      'confirm',
      'Permanently Delete User',
      `Are you sure you want to permanently delete "${user.fullName}"? This action cannot be undone and will remove all user data permanently.`,
      async () => {
        try {
          await adminUserService.hardDeleteUser(userId);
          closeAlert();
          navigate('/dashboard/users', {
            state: { message: `User "${user.fullName}" has been permanently deleted!`, type: 'success' }
          });
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error(`Failed to delete user "${user.fullName}". Please try again.`);
        }
      }
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageLoading(true);
    
    try {
      await adminUserService.uploadUserProfilePicture(userId, file);
      toast.success('Profile picture updated successfully!');
      // Refresh user data to get the new image
      fetchUserData();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageDelete = async () => {
    showAlert(
      'confirm',
      'Delete Profile Picture',
      'Are you sure you want to delete this profile picture?',
      async () => {
        try {
          await adminUserService.deleteUserProfilePicture(userId);
          closeAlert();
          toast.success('Profile picture deleted successfully!');
          // Refresh user data
          fetchUserData();
        } catch (error) {
          console.error('Error deleting profile picture:', error);
          toast.error('Failed to delete profile picture. Please try again.');
        }
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="w-5 h-5 text-purple-600" />;
      case 'User':
        return <User className="w-5 h-5 text-blue-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2";
    switch (role) {
      case 'Admin':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'User':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (isActive) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2";
    if (isActive) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  // Server offline state
  if (!isServerOnline && !isInitialCheck) {
    return (
      <OfflineState 
        onRetry={() => window.location.reload()}
        message="Unable to load user details. Please check your connection and try again."
      />
    );
  }

  // Server error state
  if (isServerError) {
    return (
      <OfflineState 
        onRetry={fetchUserData}
        message="Unable to connect to the server. Please try again."
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading user details...</p>
        </div>
      </div>
    );
  }

  // User not found
  if (!user) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
            <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600 mt-1">View and manage user information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            {user.isActive ? (
              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <UserX className="w-4 h-4" />
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleHardDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-4">
                  {user.profilePicture ? (
                    <img
                      src={getProfileImageUrl(user)}
                      alt={user.fullName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-gray-200">
                      <span className="text-white font-bold text-4xl">
                        {getUserInitials(user)}
                      </span>
                    </div>
                  )}
                  
                  {/* Image Upload/Delete Buttons */}
                  <div className="absolute bottom-0 right-0 flex gap-1">
                    <label
                      htmlFor="profileImageUpload"
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
                      title="Upload new image"
                    >
                      {imageLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </label>
                    <input
                      id="profileImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageLoading}
                    />
                    {user.profilePicture && (
                      <button
                        onClick={handleImageDelete}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        title="Delete image"
                        disabled={imageLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.fullName}</h2>
                <p className="text-gray-600 mb-4">@{user.username}</p>
                
                {/* Status and Role Badges */}
                <div className="flex flex-col gap-2 mb-6">
                  <span className={getStatusBadge(user.isActive)}>
                    {user.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={getRoleBadge(user.role)}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">User Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                    Contact Information
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{user.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium text-gray-900">{user.phone || user.phoneNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                    Account Information
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-medium text-gray-900">{user.userId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Created Date</p>
                      <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                  
                  {user.updatedAt && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {(user.address || user.dateOfBirth || user.gender) && (
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 mb-4">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.address && (
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{user.address}</p>
                      </div>
                    )}
                    {user.dateOfBirth && (
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium text-gray-900">{formatDate(user.dateOfBirth)}</p>
                      </div>
                    )}
                    {user.gender && (
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-medium text-gray-900">{user.gender}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Alert */}
        <CustomAlert
          isOpen={alert.isOpen}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
          onClose={closeAlert}
        />
      </div>
    </div>
  );
};

export default UserDetail;
