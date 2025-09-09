import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, MapPin, Ruler, Droplets, TreePine } from 'lucide-react';
import { toast } from 'react-toastify';
import { userFieldService } from '../../../services/userFieldService';
import { userFarmService } from '../../../services/userFarmService';
import { useAuth } from '../../../contexts/AuthProvider';

const FieldFormComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    fieldName: '',
    farmId: '',
    sizeAcres: '',
    location: '',
    soilType: '',
    irrigationType: '',
    isActive: true
  });

  const [userFarms, setUserFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Soil types based on common agricultural classifications
  const soilTypes = [
    'Clay',
    'Sandy',
    'Loam',
    'Silt',
    'Sandy Loam',
    'Clay Loam',
    'Silty Clay',
    'Sandy Clay',
    'Silty Clay Loam',
    'Peat',
    'Chalk',
    'Other'
  ];

  // Irrigation types
  const irrigationTypes = [
    'None',
    'Drip Irrigation',
    'Sprinkler',
    'Flood Irrigation',
    'Furrow Irrigation',
    'Centre Pivot',
    'Lateral Move',
    'Manual Watering',
    'Rain Fed',
    'Other'
  ];

  useEffect(() => {
    fetchUserFarms();
    if (isEditMode) {
      fetchFieldData();
    }
  }, [id]);

  const fetchUserFarms = async () => {
    try {
      const response = await userFarmService.getDropdown();
      setUserFarms(response.data || []);
    } catch (error) {
      console.error('Error fetching user farms:', error);
      toast.error('Failed to load farms');
    }
  };

  const fetchFieldData = async () => {
    try {
      setLoading(true);
      const response = await userFieldService.getById(id);
      const field = response.data;

      setFormData({
        fieldName: field.fieldName || '',
        farmId: field.farmId || '',
        sizeAcres: field.sizeAcres || '',
        location: field.location || '',
        soilType: field.soilType || '',
        irrigationType: field.irrigationType || '',
        isActive: field.isActive !== undefined ? field.isActive : true
      });
    } catch (error) {
      console.error('Error fetching field data:', error);
      toast.error('Failed to load field data');
      navigate('/user-dashboard/my-fields');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Field name validation (matches FieldValidator)
    if (!formData.fieldName.trim()) {
      newErrors.fieldName = 'Field name is required.';
    } else if (formData.fieldName.length > 150) {
      newErrors.fieldName = 'Field name cannot exceed 150 characters.';
    }

    // Farm ID validation (matches FieldValidator)
    if (!formData.farmId) {
      newErrors.farmId = 'Farm ID must be a valid positive integer.';
    }

    // Size acres validation (matches FieldValidator)
    if (formData.sizeAcres && (typeof formData.sizeAcres === 'string' ? formData.sizeAcres.trim() : formData.sizeAcres)) {
      const size = parseFloat(formData.sizeAcres);
      if (isNaN(size) || size <= 0) {
        newErrors.sizeAcres = 'Size (in acres) must be a positive value.';
      }
    }

    // Soil type validation (matches FieldValidator)
    if (formData.soilType && formData.soilType.length > 100) {
      newErrors.soilType = 'Soil type cannot exceed 100 characters.';
    }

    // Irrigation type validation (matches FieldValidator)
    if (formData.irrigationType && formData.irrigationType.length > 100) {
      newErrors.irrigationType = 'Irrigation type cannot exceed 100 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    // Check farm ownership
    const selectedFarm = userFarms.find(farm => farm.farmId.toString() === formData.farmId);
    if (!selectedFarm) {
      toast.error('You can only create fields in farms that you own.');
      return;
    }

    try {
      setSaving(true);
      
      const fieldData = {
        ...formData,
        sizeAcres: formData.sizeAcres ? parseFloat(formData.sizeAcres) : null,
        farmId: parseInt(formData.farmId)
      };

      if (isEditMode) {
        await userFieldService.update(id, fieldData);
        toast.success('Field updated successfully!');
      } else {
        await userFieldService.create(fieldData);
        toast.success('Field created successfully!');
      }
      
      navigate('/user-dashboard/my-fields');
    } catch (error) {
      console.error('Error saving field:', error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          serverErrors[key.toLowerCase()] = error.response.data.errors[key][0];
        });
        setErrors(serverErrors);
      }
      toast.error(isEditMode ? 'Failed to update field' : 'Failed to create field');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading field data...</p>
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
            onClick={() => navigate('/user-dashboard/my-fields')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Field' : 'Add New Field'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update field information' : 'Create a new field in your farm'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700 mb-2">
                Field Name *
              </label>
              <input
                type="text"
                id="fieldName"
                name="fieldName"
                value={formData.fieldName}
                onChange={handleInputChange}
                maxLength={150}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.fieldName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., North Field, Main Plot"
                required
              />
              {errors.fieldName && (
                <p className="mt-1 text-sm text-red-600">{errors.fieldName}</p>
              )}
            </div>

            <div>
              <label htmlFor="farmId" className="block text-sm font-medium text-gray-700 mb-2">
                Farm *
              </label>
              <select
                id="farmId"
                name="farmId"
                value={formData.farmId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.farmId ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select a farm</option>
                {userFarms.map(farm => (
                  <option key={farm.farmId} value={farm.farmId}>
                    {farm.farmName}
                  </option>
                ))}
              </select>
              {errors.farmId && (
                <p className="mt-1 text-sm text-red-600">{errors.farmId}</p>
              )}
            </div>

            <div>
              <label htmlFor="sizeAcres" className="block text-sm font-medium text-gray-700 mb-2">
                Field Size (acres)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="sizeAcres"
                  name="sizeAcres"
                  value={formData.sizeAcres}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.sizeAcres ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 5.5"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Ruler className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {errors.sizeAcres && (
                <p className="mt-1 text-sm text-red-600">{errors.sizeAcres}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location Description
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Near the main barn, South of the road"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Field Characteristics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <TreePine className="w-5 h-5 text-yellow-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Field Characteristics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                id="soilType"
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select soil type</option>
                {soilTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="irrigationType" className="block text-sm font-medium text-gray-700 mb-2">
                Irrigation Type
              </label>
              <div className="relative">
                <select
                  id="irrigationType"
                  name="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select irrigation type</option>
                  {irrigationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                  <Droplets className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active Field
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Inactive fields won't appear in crop planting selections
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/user-dashboard/my-fields')}
            className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
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
            {saving ? 'Saving...' : (isEditMode ? 'Update Field' : 'Create Field')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FieldFormComponent;
