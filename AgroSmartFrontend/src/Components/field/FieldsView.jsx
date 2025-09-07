import React, { useEffect, useState } from "react";
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Sprout, 
  Download, 
  Grid, 
  List, 
  Trash2, 
  BarChart3, 
  Home, 
  Activity,
  Edit,
  Info
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fieldService, farmService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import FieldTable from "./FieldTable";
import FieldFilter from "./FieldFilter";
import CustomAlert from "../common/CustomAlert";

const FieldsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { farmId } = useParams(); // Optional farm ID from URL
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [fields, setFields] = useState([]);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState(farmId ? { farmId } : {});
  const [filterLoading, setFilterLoading] = useState(false);
  
  // Enhanced functionality states
  const [selectedFields, setSelectedFields] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalAcres: 0
  });
  const [deletingFields, setDeletingFields] = useState(false);
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Handle success/error messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || 'success'
      });
      
      // Clear the message from location state
      window.history.replaceState({}, document.title);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    // Only fetch fields after initial server status check is complete
    if (!isInitialCheck) {
      console.log('🚀 Initial server check complete, fetching fields...');
      fetchFields();
      if (farmId) {
        fetchFarm();
      }
    }
  }, [isInitialCheck, farmId]);

  // Helper functions for alerts
  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      showCancel
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const fetchFarm = async () => {
    if (!farmId) return;
    try {
      const response = await farmService.getById(farmId);
      setFarm(response.data);
    } catch (err) {
      console.error("Error fetching farm:", err);
    }
  };

  const fetchFields = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying field filters:', filtersToUse);
    }
    
    // Use filter loading for filter operations, regular loading for initial load
    if (appliedFilters !== null) {
      setFilterLoading(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      let response;
      if (hasFilters) {
        // Use the filter API when filters are applied
        console.log('Calling fieldService.getFiltered with:', filtersToUse);
        response = await fieldService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling fieldService.getAll - no filters');
        response = await fieldService.getAll();
      }
      
      const fieldsData = Array.isArray(response.data) ? response.data : [];
      console.log('Received fields data:', fieldsData.length, 'items');
      setFields(fieldsData);
    } catch (err) {
      console.error("Error fetching fields:", err);
      const apiResponse = handleApiError(err);
      if (apiResponse.isServerDown) {
        setIsServerError(true);
        setError('Backend server is currently offline. Please check your connection and try again.');
      } else {
        setError(apiResponse.message);
      }
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleEdit = (field) => {
    console.log('Editing field:', field);
    console.log('Field ID:', field.fieldId);
    navigate(`/dashboard/fields/edit/${field.fieldId}`);
  };

  const handleAdd = () => {
    const addUrl = farmId ? `/dashboard/fields/add?farmId=${farmId}` : '/dashboard/fields/add';
    navigate(addUrl);
  };

  const handleDelete = async (field) => {
    showAlert(
      'confirm',
      'Delete Field',
      `Are you sure you want to delete "${field.fieldName}"? This action cannot be undone.`,
      async () => {
        try {
          await fieldService.delete(field.fieldId);
          setFields((prev) => prev.filter((f) => f.fieldId !== field.fieldId));
          closeAlert();
          setNotification({
            message: `Field "${field.fieldName}" deleted successfully!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error deleting field:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            `Failed to delete field "${field.fieldName}". Please try again.`
          );
        }
      },
      true
    );
  };

  // Navigate to the detail page
  const handleInfo = (field) => {
    navigate(`/dashboard/fields/${field.fieldId}`);
  };

  // Navigate to view crops in this field
  const handleViewCrops = (field) => {
    navigate(`/dashboard/fields/${field.fieldId}/crops`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFields(newFilters);
  };

  // Enhanced functionality - Analytics calculation
  useEffect(() => {
    calculateAnalytics();
  }, [fields]);

  const calculateAnalytics = () => {
    const total = fields.length;
    const active = fields.filter(field => field.isActive || field.status === 'Active').length;
    const inactive = total - active;
    const totalAcres = fields.reduce((sum, field) => sum + (parseFloat(field.acreage) || 0), 0);
    
    setAnalytics({
      total,
      active,
      inactive,
      totalAcres: totalAcres.toFixed(1)
    });
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    if (!fields.length) return;
    
    const headers = ['Field Name', 'Farm', 'Location', 'Acreage', 'Soil Type', 'Status', 'Coordinates'];
    const csvData = fields.map(field => [
      field.fieldName || '',
      field.farmName || '',
      field.location || '',
      field.acreage || '',
      field.soilType || '',
      field.isActive ? 'Active' : 'Inactive',
      field.latitude && field.longitude ? `${field.latitude}, ${field.longitude}` : ''
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fields_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk selection functionality
  const handleSelectAll = () => {
    if (selectedFields.length === fields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(fields.map(field => field.fieldId || field.id));
    }
  };

  const handleSelectField = (fieldId) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        return prev.filter(id => id !== fieldId);
      } else {
        return [...prev, fieldId];
      }
    });
  };

  // Bulk delete functionality
  const handleBulkDelete = async () => {
    if (selectedFields.length === 0) return;
    
    showAlert(
      'confirm',
      'Delete Selected Fields',
      `Are you sure you want to delete ${selectedFields.length} field${selectedFields.length !== 1 ? 's' : ''}? This action cannot be undone.`,
      async () => {
        setDeletingFields(true);
        try {
          await Promise.all(
            selectedFields.map(fieldId => fieldService.delete(fieldId))
          );
          
          setFields(prev => prev.filter(field => 
            !selectedFields.includes(field.fieldId || field.id)
          ));
          setSelectedFields([]);
          closeAlert();
          setNotification({
            message: `${selectedFields.length} field${selectedFields.length !== 1 ? 's' : ''} deleted successfully!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error deleting fields:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            'Failed to delete some fields. Please try again.'
          );
        } finally {
          setDeletingFields(false);
        }
      },
      true
    );
  };

  const pageTitle = farmId && farm ? `${farm.farmName} - Fields` : 'Field Management';
  const pageDescription = farmId && farm 
    ? `Manage fields in ${farm.farmName}` 
    : 'Manage your agricultural fields';

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      {farmId && (
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate('/dashboard/farms')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Farms
            </button>
            <span className="text-gray-500">/</span>
            <button 
              onClick={() => navigate(`/dashboard/farms/${farmId}`)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {farm?.farmName || 'Farm'}
            </button>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700">Fields</span>
          </nav>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>
            <p className="text-gray-600">{pageDescription}</p>
          </div>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      {/* Analytics Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fields</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Sprout className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Fields</p>
                <p className="text-2xl font-bold text-green-600">{analytics.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Fields</p>
                <p className="text-2xl font-bold text-red-600">{analytics.inactive}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Acres</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.totalAcres}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Component */}
      <FieldFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
        selectedFarmId={farmId}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Bulk Actions */}
              {selectedFields.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    disabled={deletingFields}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                </div>
              )}
              
              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {!loading && !error && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
            <span className="font-medium">
              {fields.length} field{fields.length !== 1 ? 's' : ''} found
              {Object.keys(filters).length > 0 && ' (filtered)'}
            </span>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading fields...</div>
          ) : error ? (
            isServerError ? (
              <OfflineState 
                message={error}
                onRetry={retryConnection}
              />
            ) : (
              <div className="p-6 text-red-500 text-center">{error}</div>
            )
          ) : viewMode === 'table' ? (
            <FieldTable
              fields={fields}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
              onViewCrops={handleViewCrops}
              selectedFields={selectedFields}
              onSelectField={handleSelectField}
              onSelectAll={handleSelectAll}
            />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fields.map((field) => (
                  <div
                    key={field.fieldId}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.fieldId)}
                          onChange={() => handleSelectField(field.fieldId)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="font-semibold text-gray-900 truncate">{field.fieldName}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        field.isActive || field.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {field.isActive || field.status === 'Active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span className="truncate">{field.farmName || 'No farm assigned'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{field.location || 'No location'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>{field.acreage ? `${field.acreage} acres` : 'No acreage'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4" />
                        <span>{field.soilType || 'No soil type'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleInfo(field)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <Info className="w-4 h-4" />
                        Details
                      </button>
                      <button
                        onClick={() => handleEdit(field)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {fields.length === 0 && (
                <div className="text-center py-12">
                  <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first field.</p>
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {!loading && !error && fields.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Field Summary & Insights</h3>
              <p className="text-gray-600">Overview of your field management data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Soil Type Distribution */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-purple-600" />
                Soil Type Distribution
              </h4>
              <div className="space-y-2">
                {fields.reduce((acc, field) => {
                  const soilType = field.soilType || 'Unknown';
                  acc[soilType] = (acc[soilType] || 0) + 1;
                  return acc;
                }, {}) && Object.entries(fields.reduce((acc, field) => {
                  const soilType = field.soilType || 'Unknown';
                  acc[soilType] = (acc[soilType] || 0) + 1;
                  return acc;
                }, {})).slice(0, 5).map(([soilType, count]) => (
                  <div key={soilType} className="flex justify-between items-center">
                    <span className="text-gray-600 truncate">{soilType}</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="bg-purple-200 rounded-full h-2"
                        style={{ width: `${(count / analytics.total) * 100}px`, minWidth: '20px' }}
                      />
                      <span className="font-medium text-gray-800">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Status Overview
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Fields</span>
                  <span className="font-bold text-green-600">{analytics.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Inactive Fields</span>
                  <span className="font-bold text-red-600">{analytics.inactive}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Rate</span>
                    <span className="font-bold text-blue-600">
                      {analytics.total > 0 ? Math.round((analytics.active / analytics.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Quick Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Fields</span>
                  <span className="font-bold text-blue-600">{analytics.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Acres</span>
                  <span className="font-bold text-purple-600">{analytics.totalAcres}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Field Size</span>
                  <span className="font-bold text-green-600">
                    {analytics.total > 0 
                      ? (parseFloat(analytics.totalAcres) / analytics.total).toFixed(1)
                      : 0} acres
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">💡 Insights</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                • Total cultivated area: {analytics.totalAcres} acres across all fields
              </div>
              <div>
                • Average field size: {analytics.total > 0 ? (parseFloat(analytics.totalAcres) / analytics.total).toFixed(1) : 0} acres per field
              </div>
              <div>
                • Active rate: {analytics.total > 0 ? Math.round((analytics.active / analytics.total) * 100) : 0}% of fields are currently active
              </div>
              <div>
                • Management status: {analytics.inactive > 0 
                  ? `${analytics.inactive} fields need attention` 
                  : 'All fields are well maintained'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        showCancel={alert.showCancel}
        confirmText={alert.type === 'confirm' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default FieldsView;
