import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  MapPin, 
  Ruler,
  Home,
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import { userFarmService } from '../../../services/userFarmService';
import { useAuth } from '../../../contexts/AuthProvider';

const FarmFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    latitude: '',
    longitude: '',
    totalAcres: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && id && id !== 'undefined') {
      fetchFarmData();
    } else if (isEditMode) {
      toast.error('Invalid farm ID');
      navigate('/user-dashboard/my-farms');
    }
  }, [isEditMode, id]);

  const fetchFarmData = async () => {
    // Don't fetch if ID is undefined or null
    if (!id || id === 'undefined') {
      toast.error('Invalid farm ID');
      navigate('/user-dashboard/my-farms');
      return;
    }

    try {
      setLoading(true);
      const response = await userFarmService.getById(id);
      const farm = response.data;
      
      // Check if current user owns this farm
      if (farm.userId !== user?.userId) {
        toast.error('You can only edit farms that you own.');
        navigate('/user-dashboard/my-farms');
        return;
      }
      
      setFormData({
        farmName: farm.farmName || '',
        location: farm.location || '',
        latitude: farm.latitude || '',
        longitude: farm.longitude || '',
        totalAcres: farm.totalAcres || '',
        isActive: farm.isActive !== undefined ? farm.isActive : true
      });
    } catch (error) {
      console.error('Error fetching farm data:', error);
      toast.error('Failed to load farm data');
      navigate('/user-dashboard/my-farms');
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

  const validateForm = () => {
    const newErrors = {};

    // Farm name validation (matches FarmValidator)
    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required.';
    } else if (formData.farmName.length > 150) {
      newErrors.farmName = 'Farm name cannot exceed 150 characters.';
    }

    // Location validation (matches FarmValidator)
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    } else if (formData.location.length > 250) {
      newErrors.location = 'Location cannot exceed 250 characters.';
    }

    // Latitude validation (matches FarmValidator)
    if (formData.latitude && (typeof formData.latitude === 'string' ? formData.latitude.trim() : formData.latitude)) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90.';
      }
    }

    // Longitude validation (matches FarmValidator)
    if (formData.longitude && (typeof formData.longitude === 'string' ? formData.longitude.trim() : formData.longitude)) {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180.';
      }
    }

    // Total acres validation (matches FarmValidator)
    if (formData.totalAcres && (typeof formData.totalAcres === 'string' ? formData.totalAcres.trim() : formData.totalAcres)) {
      const acres = parseFloat(formData.totalAcres);
      if (isNaN(acres) || acres <= 0) {
        newErrors.totalAcres = 'Total acres must be a positive number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSaving(true);
      
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        totalAcres: formData.totalAcres ? parseFloat(formData.totalAcres) : null,
        userId: user?.userId
      };

      // Include farmId for edit mode
      if (isEditMode) {
        submitData.farmId = parseInt(id);
      }

      if (isEditMode) {
        await userFarmService.update(id, submitData);
        toast.success('Farm updated successfully!');
      } else {
        await userFarmService.create(submitData);
        toast.success('Farm created successfully!');
      }
      
      navigate('/user-dashboard/my-farms');
    } catch (error) {
      console.error('Error saving farm:', error);
      
      // Show more specific error message if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          `Failed to ${isEditMode ? 'update' : 'create'} farm`;
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/user-dashboard/my-farms')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Farm' : 'Add New Farm'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update farm information' : 'Create a new farm to manage your agricultural operations'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Home className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleInputChange}
                maxLength={150}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.farmName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter farm name"
              />
              {errors.farmName && (
                <p className="text-red-500 text-sm mt-1">{errors.farmName}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Area (Acres)
              </label>
              <input
                type="number"
                name="totalAcres"
                value={formData.totalAcres}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.totalAcres ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 10.5"
              />
              {errors.totalAcres && (
                <p className="text-red-500 text-sm mt-1">{errors.totalAcres}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                maxLength={250}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter farm address or location description"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (Optional)
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="0.000001"
                  min="-90"
                  max="90"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.latitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 40.712776"
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Range: -90 to 90</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (Optional)
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="0.000001"
                  min="-180"
                  max="180"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.longitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., -74.005974"
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Globe className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">GPS Coordinates</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Adding GPS coordinates helps with precise location tracking, weather data integration, 
                    and mapping features. You can find these coordinates using your phone's GPS or online mapping tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-5 h-5 bg-gray-600 rounded mr-2"></div>
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Active (farm is operational)
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/user-dashboard/my-farms')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : (isEditMode ? 'Update Farm' : 'Create Farm')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmFormComponent;
