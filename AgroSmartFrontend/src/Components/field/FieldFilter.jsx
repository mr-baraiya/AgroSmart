import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { farmService } from "../../services";

const FieldFilter = ({ onFilterChange, loading, selectedFarmId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(false);
  
  // Filter states
  const [fieldName, setFieldName] = useState("");
  const [farmId, setFarmId] = useState(selectedFarmId || "");
  const [fieldType, setFieldType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");
  const [status, setStatus] = useState("");
  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");

  // Field type options
  const fieldTypeOptions = [
    { value: "", label: "All Types" },
    { value: "cropland", label: "Cropland" },
    { value: "pasture", label: "Pasture" },
    { value: "orchard", label: "Orchard" },
    { value: "greenhouse", label: "Greenhouse" },
    { value: "nursery", label: "Nursery" },
    { value: "experimental", label: "Experimental" }
  ];

  // Soil type options
  const soilTypeOptions = [
    { value: "", label: "All Soil Types" },
    { value: "clay", label: "Clay" },
    { value: "loam", label: "Loam" },
    { value: "sand", label: "Sand" },
    { value: "silt", label: "Silt" },
    { value: "sandy_loam", label: "Sandy Loam" },
    { value: "clay_loam", label: "Clay Loam" },
    { value: "silty_loam", label: "Silty Loam" }
  ];

  // Irrigation type options
  const irrigationTypeOptions = [
    { value: "", label: "All Irrigation Types" },
    { value: "drip", label: "Drip" },
    { value: "sprinkler", label: "Sprinkler" },
    { value: "flood", label: "Flood" },
    { value: "pivot", label: "Center Pivot" },
    { value: "furrow", label: "Furrow" },
    { value: "none", label: "None" }
  ];

  // Status options
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
    { value: "fallow", label: "Fallow" }
  ];

  // Load farms on component mount
  useEffect(() => {
    loadFarms();
  }, []);

  // Update farm filter when selectedFarmId changes
  useEffect(() => {
    if (selectedFarmId) {
      setFarmId(selectedFarmId);
    }
  }, [selectedFarmId]);

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

  const handleApplyFilters = () => {
    const filters = {};
    
    if (fieldName.trim()) filters.fieldName = fieldName.trim();
    if (farmId) filters.farmId = farmId;
    if (fieldType) filters.fieldType = fieldType;
    if (soilType) filters.soilType = soilType;
    if (irrigationType) filters.irrigationType = irrigationType;
    if (status) filters.status = status;
    if (areaFrom) filters.areaFrom = parseFloat(areaFrom);
    if (areaTo) filters.areaTo = parseFloat(areaTo);

    console.log('Applying field filters:', filters);
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFieldName("");
    setFarmId(selectedFarmId || "");
    setFieldType("");
    setSoilType("");
    setIrrigationType("");
    setStatus("");
    setAreaFrom("");
    setAreaTo("");
    onFilterChange(selectedFarmId ? { farmId: selectedFarmId } : {});
  };

  const hasActiveFilters = fieldName || (farmId && farmId !== selectedFarmId) || fieldType || soilType || irrigationType || status || areaFrom || areaTo;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-800">Filter Fields</h3>
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
          {/* Row 1: Field Name and Farm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="Search by field name..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farm
              </label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                disabled={loadingFarms || selectedFarmId}
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
          </div>

          {/* Row 2: Field Type and Soil Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type
              </label>
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {fieldTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {soilTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Irrigation Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Irrigation Type
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Row 4: Area Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area Range (acres)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={areaFrom}
                onChange={(e) => setAreaFrom(e.target.value)}
                placeholder="From"
                min="0"
                step="0.1"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={areaTo}
                onChange={(e) => setAreaTo(e.target.value)}
                placeholder="To"
                min="0"
                step="0.1"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

export default FieldFilter;
