import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Thermometer, 
  Droplets, 
  Calendar,
  Ruler,
  Wheat,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import { userCropService } from '../../../services/userCropService';
import { useAuth } from '../../../contexts/AuthProvider';

const CropFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    cropName: '',
    optimalSoilpHmin: '',
    optimalSoilpHmax: '',
    optimalTempMin: '',
    optimalTempMax: '',
    avgWaterReqmm: '',
    growthDurationDays: '',
    seedingDepthCm: '',
    harvestSeason: '',
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && id) {
      fetchCropData();
    }
  }, [isEditMode, id]);

  const fetchCropData = async () => {
    try {
      setLoading(true);
      const response = await userCropService.getById(id);
      const crop = response.data;
      
      setFormData({
        cropName: crop.cropName || '',
        optimalSoilpHmin: crop.optimalSoilpHmin || '',
        optimalSoilpHmax: crop.optimalSoilpHmax || '',
        optimalTempMin: crop.optimalTempMin || '',
        optimalTempMax: crop.optimalTempMax || '',
        avgWaterReqmm: crop.avgWaterReqmm || '',
        growthDurationDays: crop.growthDurationDays || '',
        seedingDepthCm: crop.seedingDepthCm || '',
        harvestSeason: crop.harvestSeason || '',
        description: crop.description || '',
        isActive: crop.isActive !== undefined ? crop.isActive : true
      });
    } catch (error) {
      console.error('Error fetching crop data:', error);
      toast.error('Failed to load crop data');
      navigate('/user-dashboard/my-crops');
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

    if (!formData.cropName.trim()) {
      newErrors.cropName = 'Crop name is required';
    }

    if (formData.optimalSoilpHmin && formData.optimalSoilpHmax) {
      if (parseFloat(formData.optimalSoilpHmin) >= parseFloat(formData.optimalSoilpHmax)) {
        newErrors.optimalSoilpHmax = 'Max pH must be greater than min pH';
      }
    }

    if (formData.optimalTempMin && formData.optimalTempMax) {
      if (parseFloat(formData.optimalTempMin) >= parseFloat(formData.optimalTempMax)) {
        newErrors.optimalTempMax = 'Max temperature must be greater than min temperature';
      }
    }

    if (formData.growthDurationDays && parseInt(formData.growthDurationDays) <= 0) {
      newErrors.growthDurationDays = 'Growth duration must be positive';
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
        optimalSoilpHmin: formData.optimalSoilpHmin ? parseFloat(formData.optimalSoilpHmin) : null,
        optimalSoilpHmax: formData.optimalSoilpHmax ? parseFloat(formData.optimalSoilpHmax) : null,
        optimalTempMin: formData.optimalTempMin ? parseFloat(formData.optimalTempMin) : null,
        optimalTempMax: formData.optimalTempMax ? parseFloat(formData.optimalTempMax) : null,
        avgWaterReqmm: formData.avgWaterReqmm ? parseFloat(formData.avgWaterReqmm) : null,
        growthDurationDays: formData.growthDurationDays ? parseInt(formData.growthDurationDays) : null,
        seedingDepthCm: formData.seedingDepthCm ? parseFloat(formData.seedingDepthCm) : null,
        userId: user?.userId
      };

      console.log('Submitting crop data:', submitData); // Debug log

      if (isEditMode) {
        await userCropService.update(id, submitData);
        toast.success('Crop updated successfully!');
      } else {
        await userCropService.create(submitData);
        toast.success('Crop created successfully!');
      }
      
      navigate('/user-dashboard/my-crops');
    } catch (error) {
      console.error('Error saving crop:', error);
      console.error('Error details:', error.response?.data); // Additional debug info
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} crop`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crop data...</p>
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
            onClick={() => navigate('/user-dashboard/my-crops')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Crop' : 'Add New Crop'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update crop information' : 'Create a new crop with optimal growing conditions'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Wheat className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cropName"
                value={formData.cropName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.cropName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter crop name"
              />
              {errors.cropName && (
                <p className="text-red-500 text-sm mt-1">{errors.cropName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harvest Season
              </label>
              <select
                name="harvestSeason"
                value={formData.harvestSeason}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select season</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Soil Conditions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-5 h-5 bg-green-600 rounded mr-2"></div>
            <h2 className="text-lg font-semibold text-gray-900">Soil Conditions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimal Soil pH (Min)
              </label>
              <input
                type="number"
                name="optimalSoilpHmin"
                value={formData.optimalSoilpHmin}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="14"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.optimalSoilpHmin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 6.0"
              />
              {errors.optimalSoilpHmin && (
                <p className="text-red-500 text-sm mt-1">{errors.optimalSoilpHmin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimal Soil pH (Max)
              </label>
              <input
                type="number"
                name="optimalSoilpHmax"
                value={formData.optimalSoilpHmax}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="14"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.optimalSoilpHmax ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 7.5"
              />
              {errors.optimalSoilpHmax && (
                <p className="text-red-500 text-sm mt-1">{errors.optimalSoilpHmax}</p>
              )}
            </div>
          </div>
        </div>

        {/* Temperature Requirements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Thermometer className="w-5 h-5 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Temperature Requirements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimal Temperature (Min °C)
              </label>
              <input
                type="number"
                name="optimalTempMin"
                value={formData.optimalTempMin}
                onChange={handleInputChange}
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.optimalTempMin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 15.0"
              />
              {errors.optimalTempMin && (
                <p className="text-red-500 text-sm mt-1">{errors.optimalTempMin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimal Temperature (Max °C)
              </label>
              <input
                type="number"
                name="optimalTempMax"
                value={formData.optimalTempMax}
                onChange={handleInputChange}
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.optimalTempMax ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 30.0"
              />
              {errors.optimalTempMax && (
                <p className="text-red-500 text-sm mt-1">{errors.optimalTempMax}</p>
              )}
            </div>
          </div>
        </div>

        {/* Growing Conditions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Droplets className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Growing Conditions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Water Requirement (mm)
              </label>
              <input
                type="number"
                name="avgWaterReqmm"
                value={formData.avgWaterReqmm}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 500.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Growth Duration (Days)
              </label>
              <input
                type="number"
                name="growthDurationDays"
                value={formData.growthDurationDays}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.growthDurationDays ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 90"
              />
              {errors.growthDurationDays && (
                <p className="text-red-500 text-sm mt-1">{errors.growthDurationDays}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seeding Depth (cm)
              </label>
              <input
                type="number"
                name="seedingDepthCm"
                value={formData.seedingDepthCm}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 2.5"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter crop description, notes, or additional information..."
              />
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
                Active (available for planting)
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/user-dashboard/my-crops')}
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
            {saving ? 'Saving...' : (isEditMode ? 'Update Crop' : 'Create Crop')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CropFormComponent;
