import React, { useState } from "react";
import { Search, Filter, ChevronDown, ChevronUp, RotateCcw, Cloud, Thermometer, Calendar } from "lucide-react";

const WeatherFilter = ({ onFilterChange, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    minTemperature: "",
    maxTemperature: "",
    minHumidity: "",
    maxHumidity: "",
    minWindSpeed: "",
    maxWindSpeed: "",
    weatherDescription: "",
    dataType: "",
    startDate: "",
    endDate: ""
  });

  // Data type options
  const dataTypeOptions = [
    { value: "", label: "All Types" },
    { value: "forecast", label: "Forecast" },
    { value: "current", label: "Current" },
    { value: "historical", label: "Historical" }
  ];

  // Weather description options
  const weatherDescriptionOptions = [
    { value: "", label: "All Conditions" },
    { value: "sunny", label: "Sunny" },
    { value: "cloudy", label: "Cloudy" },
    { value: "overcast", label: "Overcast" },
    { value: "rain", label: "Rainy" },
    { value: "storm", label: "Stormy" },
    { value: "snow", label: "Snowy" },
    { value: "windy", label: "Windy" },
    { value: "fog", label: "Foggy" }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const apiFilters = {};
    
    if (filters.location.trim()) apiFilters.location = filters.location.trim();
    if (filters.weatherDescription) apiFilters.weatherDescription = filters.weatherDescription;
    if (filters.dataType) apiFilters.dataType = filters.dataType;
    
    // Convert numeric values
    if (filters.minTemperature) apiFilters.minTemperature = parseFloat(filters.minTemperature);
    if (filters.maxTemperature) apiFilters.maxTemperature = parseFloat(filters.maxTemperature);
    if (filters.minHumidity) apiFilters.minHumidity = parseFloat(filters.minHumidity);
    if (filters.maxHumidity) apiFilters.maxHumidity = parseFloat(filters.maxHumidity);
    if (filters.minWindSpeed) apiFilters.minWindSpeed = parseFloat(filters.minWindSpeed);
    if (filters.maxWindSpeed) apiFilters.maxWindSpeed = parseFloat(filters.maxWindSpeed);
    
    // Handle date filters
    if (filters.startDate) apiFilters.startDate = filters.startDate;
    if (filters.endDate) apiFilters.endDate = filters.endDate;

    console.log('Applying weather filters:', apiFilters);
    onFilterChange(apiFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: "",
      minTemperature: "",
      maxTemperature: "",
      minHumidity: "",
      maxHumidity: "",
      minWindSpeed: "",
      maxWindSpeed: "",
      weatherDescription: "",
      dataType: "",
      startDate: "",
      endDate: ""
    };
    setFilters(resetFilters);
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-sky-200 mb-6">
      {/* Quick Search */}
      <div className="p-6 border-b border-sky-100">
        <div className="relative">
          <Search className="w-5 h-5 text-sky-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Quick search by location..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-sky-25"
          />
        </div>
      </div>

      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-sky-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Filter className="w-6 h-6 text-sky-600" />
          <h3 className="font-semibold text-sky-800 text-lg">Advanced Weather Filters</h3>
          {hasActiveFilters && (
            <span className="px-3 py-1 bg-sky-500 text-white text-sm rounded-full font-medium">
              {Object.values(filters).filter(v => v !== "").length} Active
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-sky-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-sky-400" />
        )}
      </div>

      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="p-6 space-y-8 bg-gradient-to-br from-sky-25 to-blue-25">
          {/* Row 1: Weather Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-sky-700 flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Weather Condition
              </label>
              <select
                value={filters.weatherDescription}
                onChange={(e) => handleFilterChange('weatherDescription', e.target.value)}
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              >
                {weatherDescriptionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-sky-700">Data Type</label>
              <select
                value={filters.dataType}
                onChange={(e) => handleFilterChange('dataType', e.target.value)}
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              >
                {dataTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Temperature Range */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-sky-700 flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Temperature Range (°C)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min Temperature"
                value={filters.minTemperature}
                onChange={(e) => handleFilterChange('minTemperature', e.target.value)}
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
              <input
                type="number"
                placeholder="Max Temperature"
                value={filters.maxTemperature}
                onChange={(e) => handleFilterChange('maxTemperature', e.target.value)}
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
            </div>
          </div>

          {/* Row 3: Humidity Range */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-sky-700">Humidity Range (%)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min Humidity"
                value={filters.minHumidity}
                onChange={(e) => handleFilterChange('minHumidity', e.target.value)}
                min="0"
                max="100"
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
              <input
                type="number"
                placeholder="Max Humidity"
                value={filters.maxHumidity}
                onChange={(e) => handleFilterChange('maxHumidity', e.target.value)}
                min="0"
                max="100"
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
            </div>
          </div>

          {/* Row 4: Wind Speed Range */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-sky-700">Wind Speed Range (km/h)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min Wind Speed"
                value={filters.minWindSpeed}
                onChange={(e) => handleFilterChange('minWindSpeed', e.target.value)}
                min="0"
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
              <input
                type="number"
                placeholder="Max Wind Speed"
                value={filters.maxWindSpeed}
                onChange={(e) => handleFilterChange('maxWindSpeed', e.target.value)}
                min="0"
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
            </div>
          </div>

          {/* Row 5: Date Range */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-sky-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 bg-white"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-sky-200">
            <div className="text-sm text-sky-600 font-medium">
              {hasActiveFilters && `${Object.values(filters).filter(v => v !== "").length} filter(s) applied`}
            </div>
            <div className="flex gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All
                </button>
              )}
              <button
                onClick={handleApplyFilters}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="p-6 border-t border-sky-100">
          <div className="flex items-center justify-center gap-3 text-sky-600">
            <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Applying weather filters...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherFilter;
