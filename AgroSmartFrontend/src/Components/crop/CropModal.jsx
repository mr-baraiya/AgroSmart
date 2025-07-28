import React, { useState, useEffect } from "react";
import { Sprout } from "lucide-react";
import { cropService } from "../../services";

// Helper to compare form states, ignoring type differences (e.g., 5 vs "5")
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    // eslint-disable-next-line eqeqeq
    return obj1 == obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};


const CropModal = ({ open, onClose, onSaved, crop }) => {
  const isEdit = !!crop;
  const initialFormState = {
    cropName: "",
    optimalSoilpHmin: "",
    optimalSoilpHmax: "",
    optimalTempMin: "",
    optimalTempMax: "",
    avgWaterReqmm: "",
    growthDurationDays: "",
    seedingDepthCm: "",
    harvestSeason: "",
    description: "", // Only this field is optional
    isActive: true,
  };

  // Harvest season options
  const harvestSeasonOptions = [
    { value: "Spring", label: "Spring (March - May)" },
    { value: "Summer", label: "Summer (June - August)" },
    { value: "Fall", label: "Fall/Autumn (September - November)" },
    { value: "Winter", label: "Winter (December - February)" },
    { value: "Year-round", label: "Year-round" },
    { value: "Multi-season", label: "Multi-season" },
    { value: "Dry Season", label: "Dry Season" },
    { value: "Wet Season", label: "Wet Season" },
    { value: "Early Spring", label: "Early Spring" },
    { value: "Late Spring", label: "Late Spring" },
    { value: "Early Summer", label: "Early Summer" },
    { value: "Late Summer", label: "Late Summer" },
    { value: "Early Fall", label: "Early Fall" },
    { value: "Late Fall", label: "Late Fall" }
  ];

  const [form, setForm] = useState(initialFormState);
  const [originalForm, setOriginalForm] = useState(null); // Store original state for comparison
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const getInitialData = () => {
        if (!crop) return initialFormState;
        // Create a clean initial state from the crop prop, ensuring all keys are present
        return Object.keys(initialFormState).reduce((acc, key) => {
          acc[key] = crop[key] !== null && crop[key] !== undefined ? crop[key] : '';
          return acc;
        }, {});
      };
      
      const initialData = getInitialData();
      setForm(initialData);
      setOriginalForm(initialData); // Set the original state for has-changes check
      setErrors({});
      setApiError(null);
    }
  }, [crop, open]);

  // Determine if there are changes
  const hasChanges = isEdit ? !deepEqual(form, originalForm) : true;

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { 
      cropName, optimalSoilpHmin, optimalSoilpHmax, optimalTempMin, optimalTempMax,
      avgWaterReqmm, growthDurationDays, seedingDepthCm, harvestSeason, description 
    } = form;

    // === CROP NAME VALIDATION (REQUIRED) ===
    if (!cropName || !cropName.trim()) {
      newErrors.cropName = "Crop name is required.";
    } else if (cropName.length > 150) {
      newErrors.cropName = "Crop name cannot exceed 150 characters.";
    }

    // === HARVEST SEASON VALIDATION (REQUIRED) ===
    if (!harvestSeason || !harvestSeason.trim()) {
      newErrors.harvestSeason = "Harvest season is required.";
    } else if (harvestSeason.length > 100) {
      newErrors.harvestSeason = "Harvest season cannot exceed 100 characters.";
    }

    // === SOIL PH VALIDATIONS (REQUIRED) ===
    if (!optimalSoilpHmin || optimalSoilpHmin === '') {
      newErrors.optimalSoilpHmin = "Minimum soil pH is required.";
    } else {
      const minPH = parseFloat(optimalSoilpHmin);
      if (isNaN(minPH)) {
        newErrors.optimalSoilpHmin = "Must be a valid number.";
      } else if (minPH < 0 || minPH > 14) {
        newErrors.optimalSoilpHmin = "Minimum soil pH must be between 0 and 14.";
      }
    }

    if (!optimalSoilpHmax || optimalSoilpHmax === '') {
      newErrors.optimalSoilpHmax = "Maximum soil pH is required.";
    } else {
      const maxPH = parseFloat(optimalSoilpHmax);
      if (isNaN(maxPH)) {
        newErrors.optimalSoilpHmax = "Must be a valid number.";
      } else if (maxPH < 0 || maxPH > 14) {
        newErrors.optimalSoilpHmax = "Maximum soil pH must be between 0 and 14.";
      }
    }

    // Cross-field pH validation
    const minPH = parseFloat(optimalSoilpHmin);
    const maxPH = parseFloat(optimalSoilpHmax);
    if (!isNaN(minPH) && !isNaN(maxPH) && minPH > maxPH) {
      newErrors.optimalSoilpHmax = "Minimum soil pH cannot be greater than maximum soil pH.";
    }

    // === TEMPERATURE VALIDATIONS (REQUIRED) ===
    if (!optimalTempMin || optimalTempMin === '') {
      newErrors.optimalTempMin = "Minimum temperature is required.";
    } else {
      const minTemp = parseFloat(optimalTempMin);
      if (isNaN(minTemp)) {
        newErrors.optimalTempMin = "Must be a valid number.";
      } else if (minTemp < -50 || minTemp > 100) {
        newErrors.optimalTempMin = "Minimum temperature must be between -50 and 100 °C.";
      }
    }

    if (!optimalTempMax || optimalTempMax === '') {
      newErrors.optimalTempMax = "Maximum temperature is required.";
    } else {
      const maxTemp = parseFloat(optimalTempMax);
      if (isNaN(maxTemp)) {
        newErrors.optimalTempMax = "Must be a valid number.";
      } else if (maxTemp < -50 || maxTemp > 100) {
        newErrors.optimalTempMax = "Maximum temperature must be between -50 and 100 °C.";
      }
    }

    // Cross-field temperature validation
    const minTemp = parseFloat(optimalTempMin);
    const maxTemp = parseFloat(optimalTempMax);
    if (!isNaN(minTemp) && !isNaN(maxTemp) && minTemp > maxTemp) {
      newErrors.optimalTempMax = "Minimum temperature cannot be greater than maximum temperature.";
    }

    // === WATER REQUIREMENT VALIDATION (REQUIRED) ===
    if (!avgWaterReqmm || avgWaterReqmm === '') {
      newErrors.avgWaterReqmm = "Average water requirement is required.";
    } else {
      const waterReq = parseFloat(avgWaterReqmm);
      if (isNaN(waterReq)) {
        newErrors.avgWaterReqmm = "Must be a valid number.";
      } else if (waterReq <= 0) {
        newErrors.avgWaterReqmm = "Average water requirement must be a positive number.";
      }
    }

    // === GROWTH DURATION VALIDATION (REQUIRED) ===
    if (!growthDurationDays || growthDurationDays === '') {
      newErrors.growthDurationDays = "Growth duration is required.";
    } else {
      const duration = parseFloat(growthDurationDays);
      if (isNaN(duration)) {
        newErrors.growthDurationDays = "Must be a valid number.";
      } else if (duration <= 0) {
        newErrors.growthDurationDays = "Growth duration must be a positive number of days.";
      }
    }

    // === SEEDING DEPTH VALIDATION (REQUIRED) ===
    if (!seedingDepthCm || seedingDepthCm === '') {
      newErrors.seedingDepthCm = "Seeding depth is required.";
    } else {
      const depth = parseFloat(seedingDepthCm);
      if (isNaN(depth)) {
        newErrors.seedingDepthCm = "Must be a valid number.";
      } else if (depth <= 0) {
        newErrors.seedingDepthCm = "Seeding depth must be a positive number.";
      }
    }

    // === DESCRIPTION VALIDATION (OPTIONAL) ===
    if (description && description.trim() && description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setApiError(null);
    setLoading(true);
    
    try {
      // Convert empty strings to null for nullable backend fields
      const payload = Object.entries(form).reduce((acc, [key, value]) => {
        const isNumericField = ['optimalSoilpHmin', 'optimalSoilpHmax', 'optimalTempMin', 'optimalTempMax', 'avgWaterReqmm', 'growthDurationDays', 'seedingDepthCm'].includes(key);
        if (isNumericField && (value === '' || value === null)) {
          acc[key] = null;
        } else if (isNumericField) {
          acc[key] = Number(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      if (isEdit) {
        payload.cropId = crop.cropId;
      }

      const res = isEdit
        ? await cropService.update(crop.cropId, payload)
        : await cropService.create(payload);
        
      onSaved(res.data, isEdit);
      onClose();
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to save crop. Please try again.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const InputField = ({ name, error, hint, ...props }) => (
    <div className="flex flex-col">
      <input 
        name={name} 
        onChange={handleChange} 
        value={form[name]} 
        className={`border p-2 rounded transition-colors ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-200'
        }`} 
        {...props} 
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      {hint && !error && <span className="text-gray-400 text-xs mt-1">{hint}</span>}
    </div>
  );

  const SelectField = ({ name, error, hint, options, ...props }) => (
    <div className="flex flex-col">
      <select 
        name={name} 
        onChange={handleChange} 
        value={form[name]} 
        className={`border p-2 rounded transition-colors ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-200'
        }`} 
        {...props}
      >
        <option value="">Select harvest season *</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      {hint && !error && <span className="text-gray-400 text-xs mt-1">{hint}</span>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {isEdit ? "Edit Crop" : "Add New Crop"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? "Modify crop information" : "Enter crop details to add to your database"}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Sprout className="w-5 h-5 text-green-500 mr-2" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  name="cropName" 
                  required 
                  placeholder="Crop Name *" 
                  error={errors.cropName}
                  hint="Required. Max 150 characters."
                />
                <SelectField 
                  name="harvestSeason" 
                  required
                  error={errors.harvestSeason}
                  hint="Required. Select the primary harvest season."
                  options={harvestSeasonOptions}
                />
              </div>
            </div>

            {/* Soil & pH Requirements */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Soil pH Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  name="optimalSoilpHmin" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="14"
                  required
                  placeholder="Minimum pH *" 
                  error={errors.optimalSoilpHmin}
                  hint="Required. Range: 0-14"
                />
                <InputField 
                  name="optimalSoilpHmax" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="14"
                  required
                  placeholder="Maximum pH *" 
                  error={errors.optimalSoilpHmax}
                  hint="Required. Range: 0-14. Must be ≥ min pH"
                />
              </div>
            </div>

            {/* Temperature Requirements */}
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Temperature Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  name="optimalTempMin" 
                  type="number" 
                  min="-50" 
                  max="100"
                  required
                  placeholder="Minimum Temperature (°C) *" 
                  error={errors.optimalTempMin}
                  hint="Required. Range: -50 to 100°C"
                />
                <InputField 
                  name="optimalTempMax" 
                  type="number" 
                  min="-50" 
                  max="100"
                  required
                  placeholder="Maximum Temperature (°C) *" 
                  error={errors.optimalTempMax}
                  hint="Required. Range: -50 to 100°C. Must be ≥ min temp"
                />
              </div>
            </div>

            {/* Growth Requirements */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
                Growth Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField 
                  name="avgWaterReqmm" 
                  type="number" 
                  min="0.1" 
                  step="0.1"
                  required
                  placeholder="Water Requirement (mm) *" 
                  error={errors.avgWaterReqmm}
                  hint="Required. Must be positive"
                />
                <InputField 
                  name="growthDurationDays" 
                  type="number" 
                  min="1" 
                  required
                  placeholder="Growth Duration (days) *" 
                  error={errors.growthDurationDays}
                  hint="Required. Must be positive"
                />
                <InputField 
                  name="seedingDepthCm" 
                  type="number" 
                  step="0.1" 
                  min="0.1"
                  required
                  placeholder="Seeding Depth (cm) *" 
                  error={errors.seedingDepthCm}
                  hint="Required. Must be positive"
                />
              </div>
            </div>

            {/* Description & Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Additional Information
              </h4>
              <div className="space-y-4">
                <div>
                  <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    rows="4" 
                    className={`border p-3 rounded-lg w-full transition-colors resize-none ${
                      errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`} 
                    placeholder="Description (optional) - Provide additional details about this crop..."
                  />
                  {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description}</span>}
                  {!errors.description && (
                    <span className="text-gray-400 text-xs mt-1 block">
                      Optional. Max 1000 characters. ({form.description?.length || 0}/1000)
                    </span>
                  )}
                </div>
                
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    checked={form.isActive} 
                    onChange={handleChange} 
                    className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" 
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mark this crop as active
                  </span>
                  <span className="text-xs text-gray-500">
                    (Active crops will appear in dropdown selections)
                  </span>
                </label>
              </div>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-1 text-sm">{apiError}</p>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                * Required fields
              </p>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !hasChanges} 
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  {loading ? "Saving..." : isEdit ? "Update Crop" : "Add Crop"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropModal;