import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { farmService, fieldService, cropService } from "../../services";

const FieldWiseCropFilter = ({ onFilterChange, loading, selectedFieldId, selectedFarmId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [farms, setFarms] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Filter states
  const [cropId, setCropId] = useState("");
  const [fieldId, setFieldId] = useState(selectedFieldId || "");
  const [farmId, setFarmId] = useState(selectedFarmId || "");
  const [status, setStatus] = useState("");
  const [plantingDateFrom, setPlantingDateFrom] = useState("");
  const [plantingDateTo, setPlantingDateTo] = useState("");

  // Status options
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "planted", label: "Planted" },
    { value: "growing", label: "Growing" },
    { value: "harvested", label: "Harvested" },
    { value: "failed", label: "Failed" }
  ];

  // Load data on component mount
  useEffect(() => {
    loadFilterData();
  }, []);

  // Update field filter when selectedFieldId changes
  useEffect(() => {
    if (selectedFieldId) {
      setFieldId(selectedFieldId);
    }
  }, [selectedFieldId]);

  // Update farm filter when selectedFarmId changes
  useEffect(() => {
    if (selectedFarmId) {
      setFarmId(selectedFarmId);
    }
  }, [selectedFarmId]);

  const loadFilterData = async () => {
    setLoadingData(true);
    try {
      const [farmsResponse, fieldsResponse, cropsResponse] = await Promise.all([
        farmService.getAll(),
        fieldService.getAll(),
        cropService.getAll()
      ]);
      
      setFarms(Array.isArray(farmsResponse.data) ? farmsResponse.data : []);
      setFields(Array.isArray(fieldsResponse.data) ? fieldsResponse.data : []);
      setCrops(Array.isArray(cropsResponse.data) ? cropsResponse.data : []);
    } catch (error) {
      console.error("Error loading filter data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleApplyFilters = () => {
    const filters = {};
    
    if (cropId) filters.cropId = cropId;
    if (fieldId) filters.fieldId = fieldId;
    if (farmId) filters.farmId = farmId;
    if (status) filters.status = status;
    if (plantingDateFrom) filters.plantingDateFrom = plantingDateFrom;
    if (plantingDateTo) filters.plantingDateTo = plantingDateTo;

    console.log('Applying field-wise crop filters:', filters);
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setCropId("");
    setFieldId(selectedFieldId || "");
    setFarmId(selectedFarmId || "");
    setStatus("");
    setPlantingDateFrom("");
    setPlantingDateTo("");
    
    const baseFilters = {};
    if (selectedFieldId) baseFilters.fieldId = selectedFieldId;
    if (selectedFarmId) baseFilters.farmId = selectedFarmId;
    
    onFilterChange(baseFilters);
  };

  const hasActiveFilters = cropId || (fieldId && fieldId !== selectedFieldId) || (farmId && farmId !== selectedFarmId) || status || plantingDateFrom || plantingDateTo;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-800">Filter Crop Assignments</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Row 1: Crop and Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop
              </label>
              <select
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
                disabled={loadingData}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">All Crops</option>
                {crops.map((crop) => (
                  <option key={crop.cropId} value={crop.cropId}>
                    {crop.cropName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field
              </label>
              <select
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
                disabled={loadingData || selectedFieldId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Fields</option>
                {fields.map((field) => (
                  <option key={field.fieldId} value={field.fieldId}>
                    {field.fieldName} ({field.farmName || 'Unknown Farm'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Farm and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farm
              </label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                disabled={loadingData || selectedFarmId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Farms</option>
                {farms.map((farm) => (
                  <option key={farm.farmId} value={farm.farmId}>
                    {farm.farmName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Planting Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planting Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={plantingDateFrom}
                onChange={(e) => setPlantingDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="From date"
              />
              <input
                type="date"
                value={plantingDateTo}
                onChange={(e) => setPlantingDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="To date"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Apply Filters
            </button>
            
            <button
              onClick={handleClearFilters}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldWiseCropFilter;
