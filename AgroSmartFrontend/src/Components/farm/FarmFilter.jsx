import React, { useState } from "react";
import { Filter, X, Search, RotateCcw } from "lucide-react";

const FarmFilter = ({ onFilterChange, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    farmName: "",
    location: "",
    isActive: "",
    minAcres: "",
    maxAcres: ""
  });

  const activeStatusOptions = [
    { value: "", label: "All Status" },
    { value: "true", label: "Active Only" },
    { value: "false", label: "Inactive Only" }
  ];

  // Track if any filters are applied
  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Clean up empty values and prepare for API
    const cleanFilters = {};
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        if (key === 'isActive') {
          // Convert string to boolean for status filter
          if (val === 'true') {
            cleanFilters['isActive'] = true;
          } else if (val === 'false') {
            cleanFilters['isActive'] = false;
          }
        } else if (key === 'farmName') {
          // Try different parameter names for farm name search
          cleanFilters['farmName'] = val;
          cleanFilters['name'] = val; // Alternative parameter name
          cleanFilters['searchTerm'] = val; // Another common name
        } else {
          // Keep other filters as is
          cleanFilters[key] = val;
        }
      }
    });
    
    console.log('Farm filter changed:', name, '=', value);
    console.log('Sending farm filters to parent:', cleanFilters);
    onFilterChange(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      farmName: "",
      location: "",
      isActive: "",
      minAcres: "",
      maxAcres: ""
    };
    setFilters(resetFilters);
    onFilterChange({});
  };

  const handleQuickSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Filter Farms</h3>
              <p className="text-sm text-gray-500">
                {hasActiveFilters ? `${Object.values(filters).filter(v => v !== "").length} filter(s) applied` : "No filters applied"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                isExpanded 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
              <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search - Always Visible */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Quick search by farm name..."
            value={filters.farmName}
            onChange={(e) => handleFilterChange('farmName', e.target.value)}
            onKeyDown={handleQuickSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
          {filters.farmName && (
            <button
              onClick={() => handleFilterChange('farmName', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="p-4 space-y-6 bg-gray-50">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="Filter by location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {activeStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Acreage Range */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Farm Size (Acres)
            </h4>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-800 mb-3">Acreage Range</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Min Acres</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 10"
                    value={filters.minAcres}
                    onChange={(e) => handleFilterChange('minAcres', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Max Acres</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 1000"
                    value={filters.maxAcres}
                    onChange={(e) => handleFilterChange('maxAcres', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {hasActiveFilters && `${Object.values(filters).filter(v => v !== "").length} filter(s) applied`}
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Applying filters...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmFilter;
