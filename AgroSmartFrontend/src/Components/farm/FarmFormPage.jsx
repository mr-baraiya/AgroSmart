import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, X, Loader2 } from "lucide-react";
import { farmService } from "../../services";
import CustomAlert from "../common/CustomAlert";
import { toast } from 'react-toastify';

const FarmFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = id && id !== 'add';

  const [form, setForm] = useState({
    farmName: "",
    location: "",
    latitude: "",
    longitude: "",
    totalAcres: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Load farm data for editing
  useEffect(() => {
    console.log('FarmFormPage useEffect - id:', id, 'isEdit:', isEdit);
    if (isEdit && id && id !== 'add') {
      console.log('Loading farm data for ID:', id);
      const loadFarm = async () => {
        setPageLoading(true);
        try {
          console.log('Calling farmService.getById with ID:', id);
          const response = await farmService.getById(id);
          console.log('Farm data response:', response);
          const farmData = response.data;
          if (farmData) {
            console.log('Setting form data:', farmData);
            setForm({
              farmName: farmData.farmName || "",
              location: farmData.location || "",
              latitude: farmData.latitude || "",
              longitude: farmData.longitude || "",
              totalAcres: farmData.totalAcres || "",
              isActive: farmData.isActive ?? true,
            });
          } else {
            console.log('No farm data received');
          }
        } catch (err) {
          console.error('Error loading farm:', err);
          console.error('Error details:', err.response);
          setErrors({ general: 'Failed to load farm data. Please try again.' });
        } finally {
          setPageLoading(false);
        }
      };
      loadFarm();
    } else {
      setPageLoading(false);
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Farm name is required
    if (!form.farmName.trim()) {
      newErrors.farmName = "Farm name is required.";
    } else if (form.farmName.length > 100) {
      newErrors.farmName = "Farm name cannot exceed 100 characters.";
    }

    // Location is required
    if (!form.location.trim()) {
      newErrors.location = "Location is required.";
    } else if (form.location.length > 200) {
      newErrors.location = "Location cannot exceed 200 characters.";
    }

    // Validate coordinates if provided
    if (form.latitude && (isNaN(form.latitude) || form.latitude < -90 || form.latitude > 90)) {
      newErrors.latitude = "Latitude must be a number between -90 and 90.";
    }
    if (form.longitude && (isNaN(form.longitude) || form.longitude < -180 || form.longitude > 180)) {
      newErrors.longitude = "Longitude must be a number between -180 and 180.";
    }

    // Validate total acres if provided
    if (form.totalAcres && (isNaN(form.totalAcres) || form.totalAcres <= 0)) {
      newErrors.totalAcres = "Total acres must be a positive number.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create payload
      const payload = { ...form };
      
      // Convert numeric fields
      ['latitude', 'longitude', 'totalAcres'].forEach(field => {
        if (payload[field] === '' || payload[field] === null) {
          payload[field] = null;
        } else {
          payload[field] = Number(payload[field]);
        }
      });
      
      if (isEdit) {
        payload.farmId = parseInt(id);
        await farmService.update(id, payload);
      } else {
        await farmService.create(payload);
      }
      
      // Show success toast
      toast.success(`Farm ${isEdit ? 'updated' : 'created'} successfully!`);
      
      navigate('/dashboard/farms');
    } catch (error) {
      console.error("API Error:", error);
      
      // Show error toast
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} farm. Please try again.`);
      
      setErrors({ 
        general: error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} farm. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/farms');
  };

  // Show loading state while fetching data for edit
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-600" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading farm details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mr-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {isEdit ? 'Edit Farm' : 'Add New Farm'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {isEdit ? 'Modify farm information in your agricultural database' : 'Create a new farm entry with location and size details'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    {isEdit ? 'Update Farm' : 'Create Farm'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              Basic Information
              <div className="ml-auto text-sm font-normal text-gray-500">Required Fields</div>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Farm Name *</label>
                <input
                  type="text"
                  name="farmName"
                  value={form.farmName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter farm name (e.g., Green Valley Farm)"
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 ${
                    errors.farmName 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-green-100 focus:bg-white'
                  }`}
                />
                {errors.farmName && (
                  <span className="text-red-500 text-sm font-medium">{errors.farmName}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter location (e.g., California, USA)"
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 ${
                    errors.location 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-green-100 focus:bg-white'
                  }`}
                />
                {errors.location && (
                  <span className="text-red-500 text-sm font-medium">{errors.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              Coordinates
              <div className="ml-auto text-sm font-normal text-gray-500">Optional</div>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleInputChange}
                  step="any"
                  min="-90"
                  max="90"
                  placeholder="e.g., 40.7128"
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 ${
                    errors.latitude 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100 focus:bg-white'
                  }`}
                />
                {errors.latitude && (
                  <span className="text-red-500 text-sm font-medium">{errors.latitude}</span>
                )}
                <span className="text-gray-500 text-sm">Range: -90 to 90</span>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleInputChange}
                  step="any"
                  min="-180"
                  max="180"
                  placeholder="e.g., -74.0060"
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 ${
                    errors.longitude 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100 focus:bg-white'
                  }`}
                />
                {errors.longitude && (
                  <span className="text-red-500 text-sm font-medium">{errors.longitude}</span>
                )}
                <span className="text-gray-500 text-sm">Range: -180 to 180</span>
              </div>
            </div>
          </div>

          {/* Size and Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              Size & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Total Acres</label>
                <input
                  type="number"
                  name="totalAcres"
                  value={form.totalAcres}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  placeholder="e.g., 100.5"
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 ${
                    errors.totalAcres 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-100 focus:bg-white'
                  }`}
                />
                {errors.totalAcres && (
                  <span className="text-red-500 text-sm font-medium">{errors.totalAcres}</span>
                )}
                <span className="text-gray-500 text-sm">Total farm area in acres</span>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <label className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200 cursor-pointer hover:from-green-100 hover:to-blue-100 transition-all duration-200 group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={form.isActive} 
                  onChange={handleInputChange} 
                  className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-2" 
                />
                {form.isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                  Mark this farm as active
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Active farms will be available for field management and appear in all farm-related dropdowns throughout the system.
                </p>
              </div>
            </label>
          </div>

          {/* Error Display */}
          {errors.general && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-500 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-800">Error</h4>
                  <p className="text-red-700 mt-1">{errors.general}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmFormPage;
