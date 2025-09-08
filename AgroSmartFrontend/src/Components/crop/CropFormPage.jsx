import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sprout, Save, X } from "lucide-react";
import { cropService } from "../../services";
import CustomAlert from "../common/CustomAlert";
import { toast } from 'react-toastify';

const CropFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    cropName: "",
    optimalSoilpHmin: "",
    optimalSoilpHmax: "",
    optimalTempMin: "",
    optimalTempMax: "",
    avgWaterReqmm: "",
    growthDurationDays: "",
    seedingDepthCm: "",
    harvestSeason: "",
    description: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  const harvestSeasonOptions = [
    { value: "Spring", label: "Spring (March - May)" },
    { value: "Summer", label: "Summer (June - August)" },
    { value: "Fall", label: "Fall/Autumn (September - November)" },
    { value: "Winter", label: "Winter (December - February)" },
    { value: "Year-round", label: "Year-round" },
  ];

  // Load crop data for editing
  useEffect(() => {
    if (isEdit && id && id !== 'add') {
      const loadCrop = async () => {
        setPageLoading(true);
        try {
          const response = await cropService.getById(id);
          const cropData = response.data;
          if (cropData) {
            setForm({
              cropName: cropData.cropName || "",
              optimalSoilpHmin: cropData.optimalSoilpHmin || "",
              optimalSoilpHmax: cropData.optimalSoilpHmax || "",
              optimalTempMin: cropData.optimalTempMin || "",
              optimalTempMax: cropData.optimalTempMax || "",
              avgWaterReqmm: cropData.avgWaterReqmm || "",
              growthDurationDays: cropData.growthDurationDays || "",
              seedingDepthCm: cropData.seedingDepthCm || "",
              harvestSeason: cropData.harvestSeason || "",
              description: cropData.description || "",
              isActive: cropData.isActive ?? true,
            });
          }
        } catch (err) {
          console.error('Error loading crop:', err);
        } finally {
          setPageLoading(false);
        }
      };
      loadCrop();
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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.cropName?.trim()) {
      newErrors.cropName = "Crop name is required.";
    }
    
    if (!form.harvestSeason?.trim()) {
      newErrors.harvestSeason = "Harvest season is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const payload = { ...form };
      
      // Convert numeric fields
      ['optimalSoilpHmin', 'optimalSoilpHmax', 'optimalTempMin', 'optimalTempMax', 
       'avgWaterReqmm', 'growthDurationDays', 'seedingDepthCm'].forEach(field => {
        if (payload[field] === '' || payload[field] === null) {
          payload[field] = null;
        } else {
          payload[field] = Number(payload[field]);
        }
      });
      
      if (isEdit) {
        payload.cropId = parseInt(id);
        await cropService.update(id, payload);
      } else {
        await cropService.create(payload);
      }
      
      // Show success toast
      toast.success(`Crop ${isEdit ? 'updated' : 'created'} successfully!`);
      
      navigate('/dashboard/crops');
    } catch (error) {
      console.error("API Error:", error);
      
      // Show error toast
      toast.error(error.response?.data?.message || `An error occurred while ${isEdit ? 'updating' : 'creating'} the crop.`);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({ isOpen: true, type, title, message, onConfirm, showCancel });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    navigate('/dashboard/crops');
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading crop data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleCancel}
                className="mr-4 p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mr-4">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {isEdit ? `Edit ${form.cropName || 'Crop'}` : 'Add New Crop'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {isEdit ? 'Modify crop information in your agricultural database' : 'Create a new crop entry with detailed specifications'}
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
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading ? 'Saving...' : isEdit ? 'Update Crop' : 'Save Crop'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              Basic Information
              <div className="ml-auto text-sm font-normal text-gray-500">Required Fields</div>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Crop Name *</label>
                <input
                  type="text"
                  name="cropName"
                  value={form.cropName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter crop name (e.g., Wheat, Rice, Corn)"
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 ${
                    errors.cropName 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-green-100 focus:bg-white'
                  }`}
                />
                {errors.cropName && (
                  <span className="text-red-500 text-sm font-medium">{errors.cropName}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Harvest Season *</label>
                <select
                  name="harvestSeason"
                  value={form.harvestSeason}
                  onChange={handleInputChange}
                  required
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 appearance-none cursor-pointer ${
                    errors.harvestSeason 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-green-100 focus:bg-white'
                  }`}
                >
                  <option value="">Select harvest season *</option>
                  {harvestSeasonOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.harvestSeason && (
                  <span className="text-red-500 text-sm font-medium">{errors.harvestSeason}</span>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe this crop in detail... Include varieties, growing tips, market information, or any other relevant details that would help farmers."
                rows="4"
                className="border-2 p-4 rounded-xl w-full transition-all duration-200 resize-none focus:ring-4 focus:ring-green-100 border-gray-200 focus:border-green-500 bg-gray-50 focus:bg-white"
              />
              <span className="text-gray-400 text-sm mt-2 block">
                Optional description. Maximum 1000 characters. ({form.description?.length || 0}/1000)
              </span>
            </div>
          </div>

          {/* Environmental Requirements */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Environmental Requirements
              <div className="ml-auto text-sm font-normal text-gray-500">Optional Fields</div>
            </h3>
            
            {/* Soil pH Section */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Soil pH Range
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Minimum pH</label>
                  <input
                    type="number"
                    name="optimalSoilpHmin"
                    value={form.optimalSoilpHmin}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="14"
                    placeholder="e.g., 6.0"
                    className="w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100 focus:bg-white"
                  />
                  <span className="text-gray-500 text-sm">Range: 0-14. Acidic (0-7) to Basic (7-14)</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Maximum pH</label>
                  <input
                    type="number"
                    name="optimalSoilpHmax"
                    value={form.optimalSoilpHmax}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="14"
                    placeholder="e.g., 7.5"
                    className="w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100 focus:bg-white"
                  />
                  <span className="text-gray-500 text-sm">Must be equal to or greater than minimum pH</span>
                </div>
              </div>
            </div>

            {/* Temperature Section */}
            <div className="mb-8 p-6 bg-orange-50 rounded-xl border border-orange-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Temperature Range
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Minimum Temperature (°C)</label>
                  <input
                    type="number"
                    name="optimalTempMin"
                    value={form.optimalTempMin}
                    onChange={handleInputChange}
                    step="0.1"
                    min="-50"
                    max="100"
                    placeholder="e.g., 15"
                    className="w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 border-gray-200 hover:border-gray-300 focus:border-orange-500 focus:ring-orange-100 focus:bg-white"
                  />
                  <span className="text-gray-500 text-sm">Range: -50 to 100°C</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Maximum Temperature (°C)</label>
                  <input
                    type="number"
                    name="optimalTempMax"
                    value={form.optimalTempMax}
                    onChange={handleInputChange}
                    step="0.1"
                    min="-50"
                    max="100"
                    placeholder="e.g., 30"
                    className="w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 border-gray-200 hover:border-gray-300 focus:border-orange-500 focus:ring-orange-100 focus:bg-white"
                  />
                  <span className="text-gray-500 text-sm">Must be equal to or greater than minimum temperature</span>
                </div>
              </div>
            </div>

            {/* Growth Requirements Section */}
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
                Growth Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Water Requirement (mm)</label>
                  <input
                    type="number"
                    name="avgWaterReqmm"
                    value={form.avgWaterReqmm}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    placeholder="e.g., 500"
                    className="w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-green-100 focus:bg-white"
                  />
                  <span className="text-gray-500 text-sm">Average water needed during growth cycle</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Growth Duration (days)</label>
                  <input
                    type="number"
                    name="growthDurationDays"
                    value={form.growthDurationDays}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="e.g., 90"
                    className="w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-green-100 focus:bg-white"
                  />
                  <span className="text-gray-500 text-sm">Time from seed to harvest</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Seeding Depth (cm)</label>
                  <input
                    type="number"
                    name="seedingDepthCm"
                    value={form.seedingDepthCm}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    placeholder="e.g., 2.5"
                    className="w-full p-4 rounded-xl border-2 transition-all duration-200 bg-white focus:ring-4 focus:ring-opacity-20 placeholder-gray-400 border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-green-100 focus:bg-white"
                  />
                  <span className="text-gray-500 text-sm">Optimal planting depth</span>
                </div>
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
                  Mark this crop as active
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Active crops will be available for selection in field management and appear in all crop-related dropdowns throughout the system.
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
                <span className="text-red-800 font-bold text-lg">Something went wrong</span>
              </div>
              <p className="text-red-700 mt-2 ml-11">{errors.general}</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        showCancel={alert.showCancel}
        confirmText={alert.type === 'confirm' ? 'Leave' : 'OK'}
        cancelText="Stay"
      />
    </div>
  );
};

export default CropFormPage;
