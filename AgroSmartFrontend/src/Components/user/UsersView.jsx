import React, { useEffect, useState } from "react";
import { Plus, Users, UserCheck, UserX, Shield, Edit, Trash2, Eye, Camera, Upload, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminUserService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import UserTable from "./UserTable";
import UserFilter from "./UserFilter";
import CustomAlert from "../common/CustomAlert";
import { toast } from 'react-toastify';
import { getProfileImageUrl, getUserInitials } from '../../utils/imageUtils';

const UsersView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterLoading, setFilterLoading] = useState(false);
  
  // Profile Picture Modal states
  const [profilePictureModal, setProfilePictureModal] = useState({
    isOpen: false,
    user: null,
    selectedFile: null,
    previewUrl: null,
    uploading: false
  });
  
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
    if (isServerOnline && !isInitialCheck) {
      fetchUsers();
    }
  }, [isServerOnline, isInitialCheck]);

  // Handle location state messages
  useEffect(() => {
    if (location.state?.message) {
      const { message, type } = location.state;
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchUsers = async (filterParams = {}) => {
    if (!isServerOnline) {
      setIsServerError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setIsServerError(false);

    try {
      let response;
      if (Object.keys(filterParams).length > 0) {
        response = await adminUserService.filterUsers(filterParams);
      } else {
        response = await adminUserService.getAllUsers();
      }
      
      console.log('👥 Users API response:', response);
      
      if (response && response.data) {
        console.log('🖼️ Sample user data:', response.data[0]);
        console.log('📝 User object keys:', Object.keys(response.data[0] || {}));
        setUsers(response.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      const errorHandled = handleApiError(err);
      
      if (!errorHandled) {
        setError("Failed to load users. Please try again.");
        setUsers([]);
      } else {
        setIsServerError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    console.log('Editing user:', user);
    console.log('User ID:', user.userId);
    navigate(`/dashboard/users/edit/${user.userId}`);
  };

  const handleAdd = () => {
    navigate('/dashboard/users/add');
  };

  const handleSoftDelete = async (user) => {
    showAlert(
      'confirm',
      'Deactivate User',
      `Are you sure you want to deactivate "${user.fullName}"? This will set the user as inactive but preserve their data.`,
      async () => {
        try {
          await adminUserService.softDeleteUser(user.userId);
          closeAlert();
          toast.success(`User "${user.fullName}" has been deactivated successfully!`);
          fetchUsers(filters); // Refresh the list
        } catch (error) {
          console.error('Error deactivating user:', error);
          toast.error(`Failed to deactivate user "${user.fullName}". Please try again.`);
        }
      }
    );
  };

  const handleHardDelete = async (user) => {
    showAlert(
      'confirm',
      'Permanently Delete User',
      `Are you sure you want to permanently delete "${user.fullName}"? This action cannot be undone and will remove all user data permanently.`,
      async () => {
        try {
          await adminUserService.hardDeleteUser(user.userId);
          closeAlert();
          toast.success(`User "${user.fullName}" has been permanently deleted!`);
          fetchUsers(filters); // Refresh the list
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error(`Failed to delete user "${user.fullName}". Please try again.`);
        }
      }
    );
  };

  // Navigate to the detail page
  const handleInfo = (user) => {
    navigate(`/dashboard/users/${user.userId}`);
  };

  // Handle profile picture editing
  const handleEditProfilePicture = (user) => {
    console.log('🖼️ Profile Picture Debug Info:', {
      userId: user.userId,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      constructedUrl: getProfileImageUrl(user),
      baseUrl: import.meta.env.VITE_IMAGE_BASE_URL
    });
    
    setProfilePictureModal({
      isOpen: true,
      user: user,
      selectedFile: null,
      previewUrl: null,
      uploading: false
    });
  };

  // Handle file selection for profile picture
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
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

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setProfilePictureModal(prev => ({
      ...prev,
      selectedFile: file,
      previewUrl: previewUrl
    }));
  };

  // Upload profile picture
  const handleUploadProfilePicture = async () => {
    if (!profilePictureModal.selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setProfilePictureModal(prev => ({ ...prev, uploading: true }));

    try {
      const response = await adminUserService.uploadUserProfilePicture(
        profilePictureModal.user.userId, 
        profilePictureModal.selectedFile
      );
      
      console.log('✅ Upload Response:', response);
      
      toast.success(`Profile picture updated for ${profilePictureModal.user.fullName}!`);
      
      // Refresh users list to get updated profile picture path
      await fetchUsers(filters);
      
      // Close modal
      handleCloseProfilePictureModal();
    } catch (error) {
      console.error('❌ Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setProfilePictureModal(prev => ({ ...prev, uploading: false }));
    }
  };

  // Delete profile picture
  const handleDeleteProfilePicture = async () => {
    showAlert(
      'confirm',
      'Delete Profile Picture',
      `Are you sure you want to delete the profile picture for "${profilePictureModal.user.fullName}"?`,
      async () => {
        try {
          await adminUserService.deleteUserProfilePicture(profilePictureModal.user.userId);
          toast.success(`Profile picture deleted for ${profilePictureModal.user.fullName}!`);
          
          // Refresh users list
          fetchUsers(filters);
          
          // Close modal
          handleCloseProfilePictureModal();
          closeAlert();
        } catch (error) {
          console.error('Error deleting profile picture:', error);
          toast.error('Failed to delete profile picture. Please try again.');
        }
      }
    );
  };

  // Close profile picture modal
  const handleCloseProfilePictureModal = () => {
    // Clean up preview URL
    if (profilePictureModal.previewUrl) {
      URL.revokeObjectURL(profilePictureModal.previewUrl);
    }
    
    setProfilePictureModal({
      isOpen: false,
      user: null,
      selectedFile: null,
      previewUrl: null,
      uploading: false
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // Server is offline
  if (!isServerOnline && !isInitialCheck) {
    return (
      <OfflineState 
        onRetry={retryConnection}
        message="Unable to load users. Please check your connection and try again."
      />
    );
  }

  // Server error state
  if (isServerError) {
    return (
      <OfflineState 
        onRetry={() => {
          setIsServerError(false);
          fetchUsers();
        }}
        message="Unable to connect to the server. Please try again."
      />
    );
  }

  // Get stats for the header cards
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const inactiveUsers = users.filter(user => !user.isActive).length;
  const adminUsers = users.filter(user => user.role === 'Admin').length;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage system users, roles, and permissions</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-3xl font-bold text-red-600">{inactiveUsers}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-3xl font-bold text-purple-600">{adminUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <UserFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
      />

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <UserTable
          users={users}
          loading={loading}
          onEdit={handleEdit}
          onSoftDelete={handleSoftDelete}
          onHardDelete={handleHardDelete}
          onInfo={handleInfo}
          onEditProfilePicture={handleEditProfilePicture}
          error={error}
        />
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

      {/* Profile Picture Management Modal */}
      {profilePictureModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Profile Picture
              </h3>
              <button
                onClick={handleCloseProfilePictureModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                For: <span className="font-semibold">{profilePictureModal.user?.fullName}</span>
              </p>
            </div>

            {/* Current Profile Picture Display */}
            <div className="mb-4 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profilePictureModal.previewUrl ? (
                  <img
                    src={profilePictureModal.previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profilePictureModal.user?.profilePicture ? (
                  <img
                    src={getProfileImageUrl(profilePictureModal.user)}
                    alt={profilePictureModal.user.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Profile image failed to load:', {
                        src: e.target.src,
                        user: profilePictureModal.user,
                        profilePicture: profilePictureModal.user?.profilePicture
                      });
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={() => {
                      console.log('✅ Profile image loaded successfully:', getProfileImageUrl(profilePictureModal.user));
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-2xl font-bold">
                    {getUserInitials(profilePictureModal.user)}
                  </div>
                )}
                {/* Fallback initials (hidden by default) */}
                <div className="text-gray-400 text-2xl font-bold" style={{ display: 'none' }}>
                  {getUserInitials(profilePictureModal.user)}
                </div>
              </div>
            </div>

            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={profilePictureModal.uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* Upload Button */}
              <button
                onClick={handleUploadProfilePicture}
                disabled={!profilePictureModal.selectedFile || profilePictureModal.uploading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {profilePictureModal.uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload
                  </>
                )}
              </button>

              {/* Delete Button - Only show if user has profile picture */}
              {profilePictureModal.user?.profilePicture && (
                <button
                  onClick={handleDeleteProfilePicture}
                  disabled={profilePictureModal.uploading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Delete
                </button>
              )}

              {/* Cancel Button */}
              <button
                onClick={handleCloseProfilePictureModal}
                disabled={profilePictureModal.uploading}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default UsersView;
