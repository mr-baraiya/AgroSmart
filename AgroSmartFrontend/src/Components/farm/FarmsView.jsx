import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Info, 
  CheckCircle, 
  XCircle, 
  Download, 
  Grid, 
  List, 
  BarChart3, 
  Home, 
  Activity,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { farmService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import { ApiError } from "../../utils/apiErrorHandler";
import FarmTable from "./FarmTable";
import FarmFilter from "./FarmFilter";
import CustomAlert from "../common/CustomAlert";
import Swal from 'sweetalert2';

const FarmsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedFarms, setSelectedFarms] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalAcres: 0
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
    // Only fetch farms after initial server status check is complete
    if (!isInitialCheck) {
      console.log('🚀 Initial server check complete, fetching farms...');
      fetchFarms();
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

  // Pagination helper functions
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedFarms([]); // Clear selection when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setSelectedFarms([]); // Clear selection
  };

  const fetchFarms = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying farm filters:', filtersToUse);
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
        console.log('Calling farmService.getFiltered with:', filtersToUse);
        response = await farmService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling farmService.getAll - no filters');
        response = await farmService.getAll();
      }
      
      const farmsData = Array.isArray(response.data) ? response.data : [];
      console.log('Received farms data:', farmsData.length, 'items');
      setFarms(farmsData);
      setTotalItems(farmsData.length);
      
      // Calculate analytics
      calculateAnalytics(farmsData);
    } catch (err) {
      console.error("Error fetching farms:", err);
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

  const handleEdit = (farm) => {
    console.log('Editing farm:', farm);
    console.log('Farm ID:', farm.farmId);
    navigate(`/dashboard/farms/edit/${farm.farmId}`);
  };

  const handleAdd = () => {
    navigate('/dashboard/farms/add');
  };

  const handleDelete = async (farm) => {
    // Show confirmation alert
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Farm',
      text: `Are you sure you want to delete "${farm.farmName}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button'
      }
    });

    if (result.isConfirmed) {
      try {
        await farmService.delete(farm.farmId);
        setFarms((prev) => prev.filter((f) => f.farmId !== farm.farmId));
        
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Farm "${farm.farmName}" has been deleted successfully.`,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        
        setNotification({
          message: `Farm "${farm.farmName}" deleted successfully!`,
          type: 'success'
        });
        setTimeout(() => setNotification(null), 5000);
      } catch (err) {
        console.error("Error deleting farm:", err);
        
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: `Failed to delete farm "${farm.farmName}". Please try again.`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
          customClass: {
            confirmButton: 'swal2-confirm-button'
          }
        });
      }
    }
  };

  // Navigate to the detail page
  const handleInfo = (farm) => {
    navigate(`/dashboard/farms/${farm.farmId}`);
  };

  // Navigate to view fields in this farm
  const handleViewFields = (farm) => {
    navigate(`/dashboard/farms/${farm.farmId}/fields`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFarms(newFilters);
  };

  // Calculate analytics from farms data
  const calculateAnalytics = (farmsData) => {
    const total = farmsData.length;
    const active = farmsData.filter(farm => farm.isActive).length;
    const inactive = total - active;
    const totalAcres = farmsData.reduce((sum, farm) => sum + (farm.totalAcres || 0), 0);

    setAnalytics({ total, active, inactive, totalAcres: totalAcres.toFixed(2) });
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    const headers = [
      'Farm Name', 'Location', 'Total Acres', 'Latitude', 'Longitude', 
      'Description', 'Status', 'Created Date'
    ];
    
    const csvData = farms.map(farm => [
      farm.farmName || '',
      farm.location || '',
      farm.totalAcres || '',
      farm.latitude || '',
      farm.longitude || '',
      farm.description || '',
      farm.isActive ? 'Active' : 'Inactive',
      farm.createdAt ? new Date(farm.createdAt).toLocaleDateString() : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `farms-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setNotification({
      message: `Successfully exported ${farms.length} farms to CSV!`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  // Bulk operations
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      // Only select farms on current page
      const currentPageFarms = getPaginatedData(farms);
      const currentPageFarmIds = currentPageFarms.map(farm => farm.farmId);
      setSelectedFarms(prev => [...new Set([...prev, ...currentPageFarmIds])]);
    } else {
      // Deselect farms on current page
      const currentPageFarms = getPaginatedData(farms);
      const currentPageFarmIds = currentPageFarms.map(farm => farm.farmId);
      setSelectedFarms(prev => prev.filter(id => !currentPageFarmIds.includes(id)));
    }
  };

  const handleSelectFarm = (farmId, isSelected) => {
    if (isSelected) {
      setSelectedFarms(prev => [...prev, farmId]);
    } else {
      setSelectedFarms(prev => prev.filter(id => id !== farmId));
    }
  };

  const handleBulkDelete = () => {
    const selectedFarmNames = farms
      .filter(farm => selectedFarms.includes(farm.farmId))
      .map(farm => farm.farmName);
    
    showAlert(
      'confirm',
      'Bulk Delete Farms',
      `Are you sure you want to delete ${selectedFarms.length} selected farms? This includes: ${selectedFarmNames.slice(0, 3).join(', ')}${selectedFarmNames.length > 3 ? ' and others...' : ''}`,
      async () => {
        try {
          await Promise.all(selectedFarms.map(farmId => farmService.delete(farmId)));
          setFarms(prev => prev.filter(farm => !selectedFarms.includes(farm.farmId)));
          setSelectedFarms([]);
          closeAlert();
          setNotification({
            message: `Successfully deleted ${selectedFarms.length} farms!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error in bulk delete:", err);
          closeAlert();
          showAlert('error', 'Bulk Delete Failed', 'Failed to delete selected farms. Please try again.');
        }
      },
      true
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Farm Management</h1>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add New Farm
          </button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading farms...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Farm Management</h1>
          <button 
            onClick={handleAddFarm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Farm
          </button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg border flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
          ) : (
            <XCircle className="w-4 h-4 lg:w-5 lg:h-5" />
          )}
          <span className="text-sm lg:text-base">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-400 hover:text-gray-600 text-lg lg:text-xl"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Farm Management</h2>
            <p className="text-sm lg:text-base text-gray-600 hidden sm:block">Manage your farms and agricultural properties</p>
          </div>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-2 rounded-lg flex items-center gap-2 text-sm lg:text-base w-full lg:w-auto justify-center"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Add Farm
        </button>
      </div>

      {/* Analytics Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-6">
          <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Farms</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">{analytics.total}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-100 rounded-full">
                <Home className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Active Farms</p>
                <p className="text-lg lg:text-2xl font-bold text-green-600">{analytics.active}</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-100 rounded-full">
                <Activity className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Inactive Farms</p>
                <p className="text-lg lg:text-2xl font-bold text-red-600">{analytics.inactive}</p>
              </div>
              <div className="p-2 lg:p-3 bg-red-100 rounded-full">
                <Activity className="w-4 h-4 lg:w-6 lg:h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Total Acres</p>
                <p className="text-lg lg:text-2xl font-bold text-purple-600">{analytics.totalAcres}</p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Component */}
      <FarmFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-visible">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Bulk Actions */}
              {selectedFarms.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedFarms.length} farm{selectedFarms.length !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    disabled={deletingFarms}
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
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-medium">
                {totalItems} farm{totalItems !== 1 ? 's' : ''} found
                {Object.keys(filters).length > 0 && ' (filtered)'}
              </span>
              {totalItems > itemsPerPage && (
                <span className="text-xs text-gray-500">
                  • Page {currentPage} of {getTotalPages()}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto overflow-y-visible">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading farms...</div>
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
            <FarmTable
              farms={getPaginatedData(farms)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
              onViewFields={handleViewFields}
              selectedFarms={selectedFarms}
              onSelectFarm={handleSelectFarm}
              onSelectAll={handleSelectAll}
            />
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getPaginatedData(farms).map((farm) => (
                  <div
                    key={farm.farmId || farm.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFarms.includes(farm.farmId || farm.id)}
                          onChange={() => handleSelectFarm(farm.farmId || farm.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="font-semibold text-gray-900 truncate">{farm.name}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        farm.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {farm.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{farm.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span>{farm.totalAcreage} acres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span>{farm.farmType}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleInfo(farm)}
                          className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewFields(farm)}
                          className="p-1.5 rounded-full hover:bg-purple-100 text-purple-600 transition-colors"
                          title="View Fields"
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(farm)}
                          className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                          title="Edit Farm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(farm)}
                          className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Farm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {farms.length === 0 && (
                <div className="text-center py-12">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No farms found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first farm.</p>
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Farm
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && !error && totalItems > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">items per page</span>
              </div>

              {/* Pagination info and controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1)
                    .filter(page => {
                      const totalPages = getTotalPages();
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                    className={`p-2 rounded ${
                      currentPage === getTotalPages() 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Section */}
      {!loading && !error && farms.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Farm Summary & Insights</h3>
              <p className="text-gray-600">Overview of your farm management data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location Distribution */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Location Distribution
              </h4>
              <div className="space-y-2">
                {farms.reduce((acc, farm) => {
                  const location = farm.location ? farm.location.split(',')[0].trim() : 'Unknown';
                  acc[location] = (acc[location] || 0) + 1;
                  return acc;
                }, {}) && Object.entries(farms.reduce((acc, farm) => {
                  const location = farm.location ? farm.location.split(',')[0].trim() : 'Unknown';
                  acc[location] = (acc[location] || 0) + 1;
                  return acc;
                }, {})).slice(0, 5).map(([location, count]) => (
                  <div key={location} className="flex justify-between items-center">
                    <span className="text-gray-600 truncate">{location}</span>
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
                  <span className="text-gray-600">Active Farms</span>
                  <span className="font-bold text-green-600">{analytics.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Inactive Farms</span>
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
                  <span className="text-gray-600">Total Properties</span>
                  <span className="font-bold text-blue-600">{analytics.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Acres</span>
                  <span className="font-bold text-purple-600">{analytics.totalAcres}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Farm Size</span>
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
                • Total farmland: {analytics.totalAcres} acres under management
              </div>
              <div>
                • Average farm size: {analytics.total > 0 ? (parseFloat(analytics.totalAcres) / analytics.total).toFixed(1) : 0} acres per farm
              </div>
              <div>
                • Active rate: {analytics.total > 0 ? Math.round((analytics.active / analytics.total) * 100) : 0}% of farms are currently active
              </div>
              <div>
                • Management status: {analytics.inactive > 0 
                  ? `${analytics.inactive} farms need attention` 
                  : 'All farms are operational'}
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

export default FarmsView;