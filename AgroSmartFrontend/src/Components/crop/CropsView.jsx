import React, { useEffect, useState } from "react";
import { Plus, CheckCircle, XCircle, Download, Grid, List, Trash2, BarChart3, Sprout, Calendar, Activity } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cropService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import CropTable from "./CropTable";
import CropFilter from "./CropFilter";
import CustomAlert from "../common/CustomAlert";
import Swal from 'sweetalert2';

const CropsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    bySeasons: {}
  });
  
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
    // Only fetch crops after initial server status check is complete
    if (!isInitialCheck) {
      console.log('🚀 Initial server check complete, fetching crops...');
      fetchCrops();
    }
  }, [isInitialCheck]);

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

  const fetchCrops = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying filters:', filtersToUse);
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
        console.log('Calling getFiltered with:', filtersToUse);
        response = await cropService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling getAll - no filters');
        response = await cropService.getAll();
      }
      
      const cropsData = Array.isArray(response.data) ? response.data : [];
      console.log('Received crops data:', cropsData.length, 'items');
      setCrops(cropsData);
      
      // Calculate analytics
      calculateAnalytics(cropsData);
    } catch (err) {
      console.error("Error fetching crops:", err);
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

  const handleEdit = (crop) => {
    console.log('Editing crop:', crop);
    console.log('Crop ID:', crop.cropId);
    navigate(`/dashboard/crops/edit/${crop.cropId}`);
  };

  const handleAdd = () => {
    navigate('/dashboard/crops/add');
  };

  const handleDelete = async (crop) => {
    // Show confirmation alert
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Crop',
      text: `Are you sure you want to delete "${crop.cropName}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      try {
        await cropService.delete(crop.cropId);
        setCrops((prev) => prev.filter((c) => c.cropId !== crop.cropId));
        
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Crop "${crop.cropName}" has been deleted successfully.`,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        
        setNotification({
          message: `Crop "${crop.cropName}" deleted successfully!`,
          type: 'success'
        });
        setTimeout(() => setNotification(null), 5000);
      } catch (err) {
        console.error("Error deleting crop:", err);
        
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: `Failed to delete crop "${crop.cropName}". Please try again.`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  // Navigate to the detail page
  const handleInfo = (crop) => {
    navigate(`/dashboard/crops/${crop.cropId}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchCrops(newFilters);
  };

  // Calculate analytics from crops data
  const calculateAnalytics = (cropsData) => {
    const total = cropsData.length;
    const active = cropsData.filter(crop => crop.isActive).length;
    const inactive = total - active;
    
    const bySeasons = cropsData.reduce((acc, crop) => {
      const season = crop.harvestSeason || 'Unknown';
      acc[season] = (acc[season] || 0) + 1;
      return acc;
    }, {});

    setAnalytics({ total, active, inactive, bySeasons });
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = [
      'Crop Name', 'Description', 'Soil pH Min', 'Soil pH Max', 
      'Temp Min (°C)', 'Temp Max (°C)', 'Water Req (mm)', 
      'Growth Days', 'Seeding Depth (cm)', 'Harvest Season', 'Status'
    ];
    
    const csvData = crops.map(crop => [
      crop.cropName || '',
      crop.description || '',
      crop.optimalSoilpHmin || '',
      crop.optimalSoilpHmax || '',
      crop.optimalTempMin || '',
      crop.optimalTempMax || '',
      crop.avgWaterReqmm || '',
      crop.growthDurationDays || '',
      crop.seedingDepthCm || '',
      crop.harvestSeason || '',
      crop.isActive ? 'Active' : 'Inactive'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `crops-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setNotification({
      message: `Successfully exported ${crops.length} crops to CSV!`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  // Bulk operations
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedCrops(crops.map(crop => crop.cropId));
    } else {
      setSelectedCrops([]);
    }
  };

  const handleSelectCrop = (cropId, isSelected) => {
    if (isSelected) {
      setSelectedCrops(prev => [...prev, cropId]);
    } else {
      setSelectedCrops(prev => prev.filter(id => id !== cropId));
    }
  };

  const handleBulkDelete = () => {
    const selectedCropNames = crops
      .filter(crop => selectedCrops.includes(crop.cropId))
      .map(crop => crop.cropName);
    
    showAlert(
      'confirm',
      'Bulk Delete Crops',
      `Are you sure you want to delete ${selectedCrops.length} selected crops? This includes: ${selectedCropNames.slice(0, 3).join(', ')}${selectedCropNames.length > 3 ? ' and others...' : ''}`,
      async () => {
        try {
          // Note: You'll need to create a bulk delete API endpoint
          await Promise.all(selectedCrops.map(cropId => cropService.delete(cropId)));
          setCrops(prev => prev.filter(crop => !selectedCrops.includes(crop.cropId)));
          setSelectedCrops([]);
          closeAlert();
          setNotification({
            message: `Successfully deleted ${selectedCrops.length} crops!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error in bulk delete:", err);
          closeAlert();
          showAlert('error', 'Bulk Delete Failed', 'Failed to delete selected crops. Please try again.');
        }
      },
      true
    );
  };

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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crop Management</h2>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            disabled={crops.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          {/* Add Crop Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4" />
            Add Crop
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Crops</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Sprout className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Crops</p>
              <p className="text-3xl font-bold text-green-600">{analytics.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Crops</p>
              <p className="text-3xl font-bold text-red-600">{analytics.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Seasons</p>
              <p className="text-3xl font-bold text-purple-600">{Object.keys(analytics.bySeasons).length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <CropFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
      />

      {/* Bulk Operations Toolbar */}
      {selectedCrops.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-800 font-medium">
              {selectedCrops.length} crop{selectedCrops.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedCrops([])}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Results Summary */}
        {!loading && !error && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 flex items-center justify-between">
            <span className="font-medium">
              {crops.length} crop{crops.length !== 1 ? 's' : ''} found
              {Object.keys(filters).length > 0 && ' (filtered)'}
            </span>
            {viewMode === 'table' && crops.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCrops.length === crops.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">Select All</span>
              </label>
            )}
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading crops...</div>
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
            <CropTable
              crops={crops}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
              selectedCrops={selectedCrops}
              onSelectCrop={handleSelectCrop}
            />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {crops.map((crop) => (
                  <div key={crop.cropId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold text-gray-900 truncate">{crop.cropName}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        crop.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {crop.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {crop.description || 'No description available'}
                    </p>
                    
                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Season:</span>
                        <span className="font-medium">{crop.harvestSeason || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Days:</span>
                        <span className="font-medium">{crop.growthDurationDays || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Req:</span>
                        <span className="font-medium">{crop.avgWaterReqmm ? `${crop.avgWaterReqmm}mm` : 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleInfo(crop)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEdit(crop)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {crops.length === 0 && (
                <div className="text-center py-12">
                  <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No crops found. Add your first crop to get started!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {!loading && !error && crops.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Crop Summary & Insights</h3>
              <p className="text-gray-600">Overview of your crop management data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Season Distribution */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Season Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(analytics.bySeasons).map(([season, count]) => (
                  <div key={season} className="flex justify-between items-center">
                    <span className="text-gray-600">{season}</span>
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
                  <span className="text-gray-600">Active Crops</span>
                  <span className="font-bold text-green-600">{analytics.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Inactive Crops</span>
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
                <Sprout className="w-5 h-5 text-blue-600" />
                Quick Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Varieties</span>
                  <span className="font-bold text-blue-600">{analytics.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Seasons Covered</span>
                  <span className="font-bold text-purple-600">{Object.keys(analytics.bySeasons).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg per Season</span>
                  <span className="font-bold text-green-600">
                    {Object.keys(analytics.bySeasons).length > 0 
                      ? Math.round(analytics.total / Object.keys(analytics.bySeasons).length) 
                      : 0}
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
                • Most common season: {Object.keys(analytics.bySeasons).length > 0 
                  ? Object.entries(analytics.bySeasons).reduce((a, b) => a[1] > b[1] ? a : b)[0]
                  : 'N/A'}
              </div>
              <div>
                • Crop diversity: {Object.keys(analytics.bySeasons).length} different seasons
              </div>
              <div>
                • Active rate: {analytics.total > 0 ? Math.round((analytics.active / analytics.total) * 100) : 0}% of crops are currently active
              </div>
              <div>
                • Management status: {analytics.inactive > 0 
                  ? `${analytics.inactive} crops need attention` 
                  : 'All crops are active'}
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

export default CropsView;