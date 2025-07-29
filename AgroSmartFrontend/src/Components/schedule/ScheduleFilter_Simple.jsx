import React, { useState, useEffect } from "react";
import { Filter, X, Search, RotateCcw } from "lucide-react";
import { fieldService } from "../../services";

const ScheduleFilter = ({ onFilterChange, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fields, setFields] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    fieldId: "",
    type: "",
    priority: "",
    status: "",
    isCompleted: "",
    startDate: "",
    endDate: ""
  });

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "Planting", label: "Planting" },
    { value: "Irrigation", label: "Irrigation" },
    { value: "Fertilization", label: "Fertilization" },
    { value: "Harvesting", label: "Harvesting" },
    { value: "Pest Control", label: "Pest Control" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Other", label: "Other" }
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "High", label: "High Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "Low", label: "Low Priority" }
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const completionOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Completed Only" },
    { value: "false", label: "Pending Only" }
  ];

  // Load fields for dropdown
  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const response = await fieldService.getAll();
      const fieldsData = Array.isArray(response.data) ? response.data : [];
      setFields(fieldsData);
    } catch (error) {
      console.error("Error loading fields:", error);
    }
  };

  // Track if any filters are applied
  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Clean up empty values and prepare for API
    const cleanFilters = {};
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        if (key === 'isCompleted') {
          // Convert string to boolean for completion filter
          if (val === 'true') {
            cleanFilters['isCompleted'] = true;
          } else if (val === 'false') {
            cleanFilters['isCompleted'] = false;
          }
        } else if (key === 'fieldId' && val) {
          // Convert fieldId to number
          cleanFilters['fieldId'] = parseInt(val);
        } else {
          cleanFilters[key] = val;
        }
      }
    });
    
    console.log('Schedule filter applied:', cleanFilters);
    onFilterChange(cleanFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      title: "",
      fieldId: "",
      type: "",
      priority: "",
      status: "",
      isCompleted: "",
      startDate: "",
      endDate: ""
    };
    setFilters(clearedFilters);
    onFilterChange({});
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Quick Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schedules by title..."
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-green-600" />
          <span className="font-medium text-gray-700">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              {Object.values(filters).filter(v => v !== "").length}
            </span>
          )}
        </div>
        <div className="text-gray-400">
          {isExpanded ? "▲" : "▼"}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
              <select
                value={filters.fieldId}
                onChange={(e) => handleFilterChange('fieldId', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Fields</option>
                {fields.map(field => (
                  <option key={field.fieldId} value={field.fieldId}>
                    {field.fieldName} {field.farmName ? `(${field.farmName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Completion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion</label>
              <select
                value={filters.isCompleted}
                onChange={(e) => handleFilterChange('isCompleted', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {completionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date From</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date Until</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Filter Actions */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-2">
              <span className="text-green-600 text-sm">Applying filters...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleFilter;
