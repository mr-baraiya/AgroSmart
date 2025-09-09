import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus, Edit3, Upload, X, User, Mail, Phone, Shield, Camera } from 'lucide-react';
import { adminUserService } from '../../services';
import { useServerStatusContext } from '../../contexts/ServerStatusProvider';
import OfflineState from '../common/OfflineState';
import { toast } from 'react-toastify';
import { getProfileImageUrl, getUserInitials } from '../../utils/imageUtils';

const UserFormPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditMode = Boolean(userId);
  const { isServerOnline, isInitialCheck, handleApiError } = useServerStatusContext();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    role: 'User',
    isActive: true,
    password: '',
    confirmPassword: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [currentProfileImage, setCurrentProfileImage] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [errors, setErrors] = useState({});

  // Check if this is a protected user
  const isProtectedUser = isEditMode && userId === '20';

  // Fetch user data for edit mode
  useEffect(() => {
    if (isEditMode && isServerOnline && !isInitialCheck && userId) {
      // Skip fetching data for protected user - will show protected UI instead
      if (isProtectedUser) {
        return;
      }
      fetchUserData();
    }
  }, [isEditMode, isServerOnline, isInitialCheck, userId, isProtectedUser]);

  const fetchUserData = async () => {
    setLoading(true);
    setIsServerError(false);
    
    try {
      const response = await adminUserService.getUserById(userId);
      if (response && response.data) {
        const userData = response.data;
        
        // Store original user data for API submission
        setOriginalUserData(userData);
        
        setFormData({
          email: userData.email || '',
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
          address: userData.address || '',
          role: userData.role || 'User',
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          password: '',
          confirmPassword: ''
        });
        setCurrentProfileImage(userData.profilePicture || null);
        // If we have a current profile image, construct the proper URL
        if (userData.profilePicture) {
          setCurrentProfileImage(getProfileImageUrl(userData));
        }
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById('profileImage');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation (only for create mode)
    if (!isEditMode) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email format is invalid';
      }
    }

    // Full name validation (always required)
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Password validation (only for create mode)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number format is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent editing protected user
    if (isProtectedUser) {
      toast.error('This user account is protected and cannot be edited.');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitLoading(true);
    
    try {
      let response;
      
      if (isEditMode) {
        // Ensure we have original user data before updating
        if (!originalUserData) {
          toast.error('User data not loaded. Please refresh and try again.');
          return;
        }
        
        // Update user - send complete object with proper field names for the API
        const updateData = {
          userId: originalUserData.userId || parseInt(userId),
          fullName: formData.fullName,
          email: originalUserData.email || '', // Keep original email (not editable)
          passwordHash: originalUserData.passwordHash || originalUserData.password || '', // Keep original password
          role: formData.role,
          phone: formData.phoneNumber || '',
          address: formData.address || '',
          isActive: formData.isActive,
          createdAt: originalUserData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(), // Update timestamp
          profileImage: originalUserData.profileImage || originalUserData.profilePicture || ''
        };
        
        console.log('📝 Sending update data:', updateData);
        response = await adminUserService.updateUser(userId, updateData);
      } else {
        // Create new user - match exact API structure
        const createData = {
          userId: 0,
          fullName: formData.fullName,
          email: formData.email,
          passwordHash: formData.password,
          role: formData.role,
          phone: formData.phoneNumber || '',
          address: formData.address || '',
          isActive: formData.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profileImage: ''
        };
        
        console.log('🔍 Sending create user data:', createData);
        response = await adminUserService.createUser(createData);
      }

      if (response && response.data) {
        const userIdForImage = isEditMode ? userId : response.data.userId;
        let imageUploadSuccess = true;
        
        // Upload profile image if provided (only for create mode)
        if (!isEditMode && profileImage && userIdForImage) {
          try {
            console.log('Uploading profile image for user:', userIdForImage);
            const imageResponse = await adminUserService.uploadUserProfilePicture(userIdForImage, profileImage);
            console.log('Profile image uploaded successfully:', imageResponse);
            toast.success('Profile picture uploaded successfully!');
          } catch (imageError) {
            console.error('Error uploading profile picture:', imageError);
            imageUploadSuccess = false;
            
            if (imageError.response?.data?.message) {
              toast.error(`Profile picture upload failed: ${imageError.response.data.message}`);
            } else {
              toast.error('Profile picture upload failed. Please try uploading it again from the user details page.');
            }
          }
        }

        // Show appropriate success message
        const baseMessage = isEditMode 
          ? `User "${formData.fullName}" updated successfully!`
          : `User "${formData.fullName}" created successfully!`;
          
        const finalMessage = profileImage && !imageUploadSuccess 
          ? `${baseMessage} However, profile picture upload failed.`
          : baseMessage;
        
        navigate('/dashboard/users', {
          state: { message: finalMessage, type: 'success' }
        });
      }
    } catch (error) {
      console.error('Error saving user:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(isEditMode ? 'Failed to update user' : 'Failed to create user');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/users');
  };

  // Server offline state
  if (!isServerOnline && !isInitialCheck) {
    return (
      <OfflineState 
        onRetry={() => window.location.reload()}
        message="Unable to load user form. Please check your connection and try again."
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

  // Protected user state
  if (isProtectedUser) {
    return (
      <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-9a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Protected User Account</h2>
            <p className="text-red-600 mb-6">
              This user account is protected and cannot be edited for security reasons.
            </p>
            <button
              onClick={() => navigate('/dashboard/users')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for edit mode
  if (isEditMode && loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading user data...</p>
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
              onClick={handleCancel}
              className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {isEditMode ? <Edit3 className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode ? 'Update user information and settings' : 'Create a new user account'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Profile Image Section - Only show in create mode */}
            {!isEditMode && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profileImagePreview || currentProfileImage ? (
                      <img
                        src={profileImagePreview || currentProfileImage}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        onError={(e) => {
                          // If image fails to load, show initials
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                      style={{ display: (profileImagePreview || currentProfileImage) ? 'none' : 'flex' }}
                    >
                      {formData.fullName ? (
                        <span className="text-white font-bold text-2xl">
                          {getUserInitials({ fullName: formData.fullName })}
                        </span>
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    {profileImagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove new image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="profileImage"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                      <Camera className="w-4 h-4" />
                      Choose Image
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a profile picture (Max 5MB, JPG, PNG, GIF)
                    </p>
                    {profileImagePreview && (
                      <p className="text-sm text-blue-600 mt-1">
                        ✓ New image selected - it will be uploaded when you save the user
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className={!isEditMode ? '' : 'md:col-span-2'}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email - Read-only in edit mode, editable in create mode */}
                {!isEditMode ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Read-only)
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed through this form
                    </p>
                  </div>
                )}

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Address field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <div className="relative">
                    <Shield className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active Account
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Inactive accounts cannot login to the system
                  </p>
                </div>
              </div>
            </div>

            {/* Password Section - Only show in create mode */}
            {!isEditMode && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Password *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEditMode ? 'Update User' : 'Create User'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;
