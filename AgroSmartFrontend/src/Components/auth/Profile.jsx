import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Eye, EyeOff, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthProvider';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import CustomAlert from '../common/CustomAlert';
import ProfileImageUpload from '../common/ProfileImageUpload';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../config';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  const [originalData, setOriginalData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Alert state
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  useEffect(() => {
    // Load initial user data only once when user ID is available
    if (user?.userId && !formData.fullName) {
      loadUserProfile();
    }
  }, [user?.userId]); // Only depend on userId, not the entire user object

  const loadUserProfile = async () => {
    if (!user?.userId) return;

    try {
      setProfileLoading(true);
      
      // Fetch complete user profile data by ID
      const response = await userService.getById(user.userId);
      const userData = response.data;
      
      console.log('✅ User profile loaded successfully');
      
      const profileData = {
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        role: userData.role || ''
      };
      
      setFormData(profileData);
      setOriginalData(profileData);
      
      // Only update user context if profile image or other key data has changed
      if (userData.profileImage !== user.profileImage || 
          userData.fullName !== user.fullName ||
          userData.phone !== user.phone ||
          userData.address !== user.address) {
        updateUser({ ...user, ...userData });
      }
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load profile data');
      
      // Fallback to existing user data
      if (user) {
        const fallbackData = {
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          role: user.role || ''
        };
        setFormData(fallbackData);
        setOriginalData(fallbackData);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      showCancel
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfileForm = () => {
    const errors = {};

    // Full name validation (3-100 characters, required, cannot be "Admin")
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters';
    } else if (formData.fullName.trim().length > 100) {
      errors.fullName = 'Full name must be between 3 to 100 characters';
    } else if (formData.fullName.trim() === 'Admin') {
      errors.fullName = 'Full name cannot be "Admin"';
    }

    // Email validation (required, valid email format)
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone validation (10 digits if provided)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone must be a 10-digit number';
    }

    // Address validation (max 200 characters if provided)
    if (formData.address && formData.address.length > 200) {
      errors.address = 'Address must be under 200 characters';
    }

    // Role validation (must be User or Admin)
    if (!formData.role) {
      errors.role = 'Role is required';
    } else if (formData.role !== 'User' && formData.role !== 'Admin') {
      errors.role = 'Role must be either "User" or "Admin"';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a complete user object that matches the backend UserValidator requirements
      const profileUpdateData = {
        userId: user.userId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        passwordHash: user.passwordHash, // Required by validator - keep existing password
        role: formData.role || user.role || 'User',
        phone: formData.phone.replace(/\D/g, '') || null, // Must be 10 digits or null
        address: formData.address.trim() || null,
        isActive: user.isActive !== undefined ? user.isActive : true,
        profileImage: user.profileImage || null,
        createdAt: user.createdAt || new Date().toISOString(), // Required by validator
        updatedAt: new Date().toISOString() // Required by validator
      };

      // Validate phone number format (must be exactly 10 digits if provided)
      if (profileUpdateData.phone && profileUpdateData.phone.length !== 10) {
        toast.error('Phone number must be exactly 10 digits');
        setError('Phone number must be exactly 10 digits');
        return;
      }

      // Validate full name length (3-100 characters)
      if (profileUpdateData.fullName.length < 3 || profileUpdateData.fullName.length > 100) {
        toast.error('Full name must be between 3 to 100 characters');
        setError('Full name must be between 3 to 100 characters');
        return;
      }

      // Validate address length (max 200 characters)
      if (profileUpdateData.address && profileUpdateData.address.length > 200) {
        toast.error('Address must be under 200 characters');
        setError('Address must be under 200 characters');
        return;
      }

      // Call the userService update method with user ID
      const response = await userService.update(user.userId, profileUpdateData);
      
      console.log('✅ Profile updated successfully for user ID:', user.userId);
      console.log('Profile update response:', response);
      console.log('Updated user data received:', response.data);
      
      // Update local state and context with the response data
      const updatedUserData = response.data || { ...user, ...profileUpdateData };
      updateUser(updatedUserData);
      
      // Update both form data and original data
      setFormData({
        fullName: updatedUserData.fullName || '',
        email: updatedUserData.email || '',
        phone: updatedUserData.phone || '',
        address: updatedUserData.address || '',
        role: updatedUserData.role || ''
      });
      
      setOriginalData({
        fullName: updatedUserData.fullName || '',
        email: updatedUserData.email || '',
        phone: updatedUserData.phone || '',
        address: updatedUserData.address || '',
        role: updatedUserData.role || ''
      });
      
      setIsEditing(false);
      
      // Show success toast
      toast.success('Profile updated successfully!');
      
      setNotification({
        message: 'Profile updated successfully!',
        type: 'success'
      });
      setTimeout(() => setNotification(null), 5000);
      
    } catch (err) {
      console.error('Profile update error:', err.response?.data || err.message);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (err.response?.status === 400) {
        const errorData = err.response?.data;
        
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.title) {
          errorMessage = errorData.title;
        } else if (errorData?.errors) {
          console.error('Validation errors:', errorData.errors);
          const errorMessages = Object.values(errorData.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData) {
          errorMessage = `Server validation error: ${JSON.stringify(errorData)}`;
        }
      } else if (err.response?.status === 404) {
        errorMessage = 'User not found. Please login again.';
      } else if (err.response?.status === 401) {
        errorMessage = 'You are not authorized to update this profile.';
      } else {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    setFormData(originalData);
    setValidationErrors({});
    setIsEditing(false);
    setError('');
  };

  const handleRefreshProfile = () => {
    loadUserProfile();
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const passwordChangeData = {
        userId: user.userId,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };
      
      console.log('✅ Password change attempt for user ID:', user.userId);
      
      // Use authService with the correct Auth endpoint
      await authService.changePassword(passwordChangeData);

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
      
      // Show success toast
      toast.success('Password changed successfully!');
      
      setNotification({
        message: 'Password changed successfully!',
        type: 'success'
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error('Password change error:', err.response?.data || err.message);
      
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (err.response?.status === 400) {
        const errorData = err.response?.data;
        
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.title) {
          errorMessage = errorData.title;
        } else if (errorData?.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else {
          errorMessage = 'Current password is incorrect or new password doesn\'t meet requirements.';
        }
      } else if (err.response?.status === 404) {
        errorMessage = 'Password change endpoint not found. Please contact support.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Current password is incorrect.';
      } else {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      
      // Show error toast
      toast.error(errorMessage);
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || ''
    });
    setIsEditing(false);
    setError('');
    setValidationErrors({});
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {profileLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading profile data...</span>
          </div>
        </div>
      )}

      {/* Profile Content - Only show when not loading */}
      {!profileLoading && (
        <>
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <ProfileImageUpload 
              user={user} 
              size="lg" 
            />
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
              <p className="text-gray-600">{user.role} • {user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {!isEditing && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleRefreshProfile}
                disabled={profileLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${profileLoading ? 'animate-spin' : ''}`} />
                {profileLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
              <span className="text-red-500">*</span>
              {isEditing && (
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.fullName.length}/100 characters)
                </span>
              )}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={100}
                minLength={3}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name (3-100 characters)"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.fullName}</p>
            )}
            {validationErrors.fullName && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.email}</p>
            )}
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
              {isEditing && formData.phone && (
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.phone.replace(/\D/g, '').length}/10 digits)
                </span>
              )}
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={15}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit phone number"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.phone || 'Not provided'}</p>
            )}
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.role}</p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
              {isEditing && (
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.address.length}/200 characters)
                </span>
              )}
            </label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                maxLength={200}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter address (max 200 characters)"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.address || 'Not provided'}</p>
            )}
            {validationErrors.address && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <p className="text-gray-600">Manage your password and security settings</p>
          </div>
          {!showChangePassword && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          )}
        </div>

        {showChangePassword && (
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Password Change Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setValidationErrors({});
                  setError('');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        showCancel={alert.showCancel}
      />
    </div>
  );
};

export default Profile;
