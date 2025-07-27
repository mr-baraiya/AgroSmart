import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "@/config";

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
    description: "",
    isActive: true,
  };

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

    // --- Text Field Validations ---
    if (!cropName.trim()) newErrors.cropName = "Crop name is required.";
    else if (cropName.length > 150) newErrors.cropName = "Crop name cannot exceed 150 characters.";

    if (harvestSeason && harvestSeason.length > 100) newErrors.harvestSeason = "Harvest season cannot exceed 100 characters.";
    if (description && description.length > 1000) newErrors.description = "Description cannot exceed 1000 characters.";

    // --- Numeric and Range Validations ---
    const parseAndValidate = (value, name, rules) => {
        if (value === '' || value === null) return; // Not required, so skip if empty
        const num = parseFloat(value);
        if (isNaN(num)) {
            newErrors[name] = "Must be a valid number.";
            return;
        }
        if (rules.min !== undefined && num < rules.min) newErrors[name] = `Value must be at least ${rules.min}.`;
        if (rules.max !== undefined && num > rules.max) newErrors[name] = `Value cannot exceed ${rules.max}.`;
        if (rules.greaterThan !== undefined && num <= rules.greaterThan) newErrors[name] = `Value must be greater than ${rules.greaterThan}.`;
    };

    parseAndValidate(optimalSoilpHmin, 'optimalSoilpHmin', { min: 0, max: 14 });
    parseAndValidate(optimalSoilpHmax, 'optimalSoilpHmax', { min: 0, max: 14 });
    parseAndValidate(optimalTempMin, 'optimalTempMin', { min: -50, max: 100 });
    parseAndValidate(optimalTempMax, 'optimalTempMax', { min: -50, max: 100 });
    parseAndValidate(avgWaterReqmm, 'avgWaterReqmm', { greaterThan: 0 });
    parseAndValidate(growthDurationDays, 'growthDurationDays', { greaterThan: 0 });
    parseAndValidate(seedingDepthCm, 'seedingDepthCm', { greaterThan: 0 });

    // --- Cross-field Validations ---
    const pHmin = parseFloat(optimalSoilpHmin);
    const pHmax = parseFloat(optimalSoilpHmax);
    if (!isNaN(pHmin) && !isNaN(pHmax) && pHmin > pHmax) {
      newErrors.optimalSoilpHmax = "Max pH cannot be less than min pH.";
    }

    const tempMin = parseFloat(optimalTempMin);
    const tempMax = parseFloat(optimalTempMax);
    if (!isNaN(tempMin) && !isNaN(tempMax) && tempMin > tempMax) {
      newErrors.optimalTempMax = "Max temperature cannot be less than min temperature.";
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
        ? await axios.put(`${API_BASE_URL}/Crop/${crop.cropId}`, payload)
        : await axios.post(`${API_BASE_URL}/Crop`, payload);
        
      onSaved(res.data, isEdit);
      onClose();
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to save crop. Please try again.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const InputField = ({ name, error, ...props }) => (
    <div className="flex flex-col">
      <input name={name} onChange={handleChange} value={form[name]} className={`border p-2 rounded ${error ? 'border-red-500' : 'border-gray-300'}`} {...props} />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit} noValidate>
        <div className="flex justify-between items-center mb-4 border-b pb-2 sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Crop" : "Add New Crop"}</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField name="cropName" required placeholder="Crop Name" error={errors.cropName} />
          <InputField name="harvestSeason" placeholder="Harvest Season (e.g., Summer)" error={errors.harvestSeason} />
          <InputField name="optimalSoilpHmin" type="number" step="0.1" placeholder="Soil pH Min (0-14)" error={errors.optimalSoilpHmin} />
          <InputField name="optimalSoilpHmax" type="number" step="0.1" placeholder="Soil pH Max (0-14)" error={errors.optimalSoilpHmax} />
          <InputField name="optimalTempMin" type="number" placeholder="Temp Min °C (-50 to 100)" error={errors.optimalTempMin} />
          <InputField name="optimalTempMax" type="number" placeholder="Temp Max °C (-50 to 100)" error={errors.optimalTempMax} />
          <InputField name="avgWaterReqmm" type="number" placeholder="Water req. (mm)" error={errors.avgWaterReqmm} />
          <InputField name="growthDurationDays" type="number" placeholder="Duration (days)" error={errors.growthDurationDays} />
          <InputField name="seedingDepthCm" type="number" step="0.1" placeholder="Seeding Depth (cm)" error={errors.seedingDepthCm} />
          
          <div className="md:col-span-2">
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" className={`border p-2 rounded w-full ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Description"></textarea>
            {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description}</span>}
          </div>
          
          <label className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4" />
            Is this crop currently active?
          </label>
        </div>
        
        {apiError && <div className="text-red-500 my-3 text-center p-2 bg-red-50 rounded">{apiError}</div>}
        
        <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white py-4">
           <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
            Cancel
          </button>
          <button type="submit" disabled={loading || !hasChanges} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CropModal;