import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, MapPin, Sprout } from "lucide-react";
import { fieldService, farmService } from "../../services";

const FieldFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const preselectedFarmId = searchParams.get('farmId');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fieldName: "",
    farmId: preselectedFarmId || "",
    fieldType: "",
    areaInAcres: "",
    soilType: "",
    irrigationType: "",
    status: "active",
    description: "",
    latitude: "",
    longitude: "",
    elevation: ""
  });

  const fieldTypeOptions = [
    { value: "", label: "Select Field Type" },
    { value: "cropland", label: "Cropland" },
    { value: "pasture", label: "Pasture" },
    { value: "orchard", label: "Orchard" },
    { value: "greenhouse", label: "Greenhouse" },
    { value: "nursery", label: "Nursery" },
    { value: "experimental", label: "Experimental" }
  ];

  const soilTypeOptions = [
    { value: "", label: "Select Soil Type" },
    { value: "clay", label: "Clay" },
    { value: "loam", label: "Loam" },
    { value: "sand", label: "Sand" },
    { value: "silt", label: "Silt" },
    { value: "sandy_loam", label: "Sandy Loam" },
    { value: "clay_loam", label: "Clay Loam" },
    { value: "silty_loam", label: "Silty Loam" }
  ];

  const irrigationTypeOptions = [
    { value: "", label: "Select Irrigation Type" },
    { value: "drip", label: "Drip" },
    { value: "sprinkler", label: "Sprinkler" },
    { value: "flood", label: "Flood" },
    { value: "pivot", label: "Center Pivot" },
    { value: "furrow", label: "Furrow" },
    { value: "none", label: "None" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
    { value: "fallow", label: "Fallow" }
  ];

  useEffect(() => {
    loadFarms();
    if (isEdit) {
      loadField();
    }
  }, [id, isEdit]);

  const loadFarms = async () => {
    setLoadingFarms(true);
    try {
      const response = await farmService.getAll();
      const farmsData = Array.isArray(response.data) ? response.data : [];
      setFarms(farmsData);
    } catch (error) {
      console.error("Error loading farms:", error);
    } finally {
      setLoadingFarms(false);
    }
  };

  const loadField = async () => {
    setLoading(true);
    try {
      const response = await fieldService.getById(id);
      const field = response.data;
      
      setFormData({
        fieldName: field.fieldName || "",
        farmId: field.farmId || "",
        fieldType: field.fieldType || "",
        areaInAcres: field.areaInAcres || "",
        soilType: field.soilType || "",
        irrigationType: field.irrigationType || "",
        status: field.status || "active",
        description: field.description || "",
        latitude: field.latitude || "",
        longitude: field.longitude || "",
        elevation: field.elevation || ""
      });
    } catch (error) {
      console.error("Error loading field:", error);
      navigate("/fields", {
        state: {
          message: "Failed to load field data",
          type: "error"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fieldName.trim()) {
      newErrors.fieldName = "Field name is required";
    }

    if (!formData.farmId) {
      newErrors.farmId = "Farm selection is required";
    }

    if (!formData.fieldType) {
      newErrors.fieldType = "Field type is required";
    }

    if (!formData.areaInAcres || parseFloat(formData.areaInAcres) <= 0) {
      newErrors.areaInAcres = "Valid area is required";
    }

    if (formData.latitude && (isNaN(parseFloat(formData.latitude)) || parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90)) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }

    if (formData.longitude && (isNaN(parseFloat(formData.longitude)) || parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180)) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        areaInAcres: parseFloat(formData.areaInAcres),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        elevation: formData.elevation ? parseFloat(formData.elevation) : null
      };

      if (isEdit) {
        await fieldService.update(id, submitData);
        navigate("/fields", {
          state: {
            message: `Field "${formData.fieldName}" updated successfully!`,
            type: "success"
          }
        });
      } else {
        await fieldService.create(submitData);
        navigate("/fields", {
          state: {
            message: `Field "${formData.fieldName}" created successfully!`,
            type: "success"
          }
        });
      }
    } catch (error) {
      console.error("Error saving field:", error);
      setErrors({
        submit: `Failed to ${isEdit ? 'update' : 'create'} field. Please try again.`
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (preselectedFarmId) {
      navigate(`/farms/${preselectedFarmId}/fields`);
    } else {
      navigate("/fields");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Loading field data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fields
        </button>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Field' : 'Add New Field'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update field information' : 'Enter field details to add to your farm'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {errors.submit}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name *
                </label>
                <input
                  type="text"
                  name="fieldName"
                  value={formData.fieldName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fieldName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter field name"
                />
                {errors.fieldName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fieldName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm *
                </label>
                <select
                  name="farmId"
                  value={formData.farmId}
                  onChange={handleInputChange}
                  disabled={loadingFarms || preselectedFarmId}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.farmId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a farm</option>
                  {farms.map((farm) => (
                    <option key={farm.farmId} value={farm.farmId}>
                      {farm.farmName}
                    </option>
                  ))}
                </select>
                {errors.farmId && (
                  <p className="text-red-500 text-sm mt-1">{errors.farmId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Type *
                </label>
                <select
                  name="fieldType"
                  value={formData.fieldType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fieldType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {fieldTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.fieldType && (
                  <p className="text-red-500 text-sm mt-1">{errors.fieldType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (acres) *
                </label>
                <input
                  type="number"
                  name="areaInAcres"
                  value={formData.areaInAcres}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.areaInAcres ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter area in acres"
                />
                {errors.areaInAcres && (
                  <p className="text-red-500 text-sm mt-1">{errors.areaInAcres}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soil Type
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {soilTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Irrigation Type
                </label>
                <select
                  name="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {irrigationTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  min="-90"
                  max="90"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.latitude ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 40.7128"
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  min="-180"
                  max="180"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.longitude ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., -74.0060"
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Elevation (feet)
                </label>
                <input
                  type="number"
                  name="elevation"
                  value={formData.elevation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1000"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter field description (optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : (isEdit ? 'Update Field' : 'Create Field')}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldFormPage;
