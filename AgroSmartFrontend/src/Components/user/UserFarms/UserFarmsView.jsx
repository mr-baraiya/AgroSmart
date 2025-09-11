import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar,
  Wheat,
  Filter,
  Eye,
  Edit,
  Trash2,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { farmService } from '../../../services/farmService';
import { fieldService } from '../../../services/fieldService';
import { useServerStatusContext } from '../../../contexts/ServerStatusProvider';
import { useAuth } from '../../../contexts/AuthProvider';

const UserFarmsView = () => {
  const { user } = useAuth();
  const { isServerOnline, isInitialCheck, handleApiError } = useServerStatusContext();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minAcres, setMinAcres] = useState('');
  const [maxAcres, setMaxAcres] = useState('');
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Memoized unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = farms
      .map(farm => farm.location || farm.address)
      .filter(location => location && location !== 'No location specified')
      .filter((location, index, array) => array.indexOf(location) === index)
      .sort();
    return locations;
  }, [farms]);

  // Helper function to check if current user owns the farm
  const isOwnedByCurrentUser = (farm) => {
    return farm.createdBy === user?.userId || farm.userId === user?.userId;
  };

  useEffect(() => {
    // Only fetch data after initial server status check is complete and server is online
    if (!isInitialCheck && isServerOnline) {
      fetchUserFarms();
    } else if (!isInitialCheck && !isServerOnline) {
      setFarms([]);
      setFilteredFarms([]);
      setLoading(false);
    }
  }, [isInitialCheck, isServerOnline]);

  // Debounced filter application
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, selectedLocation, minAcres, maxAcres]);

  // Apply filters when farms data changes (without debounce)
  useEffect(() => {
    if (farms.length > 0) {
      applyFilters();
    }
  }, [farms]);

  const applyFilters = useCallback(async () => {
    try {
      setIsFiltering(true);
      
      // Build filter parameters
      const filters = {};
      
      if (searchTerm) filters.name = searchTerm;
      if (selectedLocation) filters.location = selectedLocation;
      if (minAcres) filters.minAcres = parseFloat(minAcres);
      if (maxAcres) filters.maxAcres = parseFloat(maxAcres);

      // If no filters are applied, show all farms
      if (Object.keys(filters).length === 0) {
        setFilteredFarms(farms);
        return;
      }

      // Use API filtering
      const response = await farmService.getFiltered(filters);
      const filteredData = response.data || [];
      
      // Enrich filtered farms with field data (we need to fetch fields for accurate counts)
      const fieldsResponse = await fieldService.getAll();
      const allFields = fieldsResponse.data || [];
      
      const enrichedFilteredFarms = filteredData.map(farm => {
        // Count fields belonging to this farm
        const farmFields = allFields.filter(field => field.farmId === farm.farmId);
        const fieldsCount = farmFields.length;
        
        // Calculate total field area for this farm
        const totalFieldArea = farmFields.reduce((sum, field) => sum + (field.sizeAcres || 0), 0);
        
        return {
          ...farm,
          // Map API response properties to expected component properties
          id: farm.farmId,
          name: farm.farmName,
          location: farm.location || farm.address || 'No location specified',
          area: farm.totalAcres || totalFieldArea || 0,
          fieldsCount: fieldsCount,
          cropsCount: farm.cropsCount || 0,
          // Keep original properties
          farmId: farm.farmId,
          farmName: farm.farmName,
          totalAcres: farm.totalAcres,
          isActive: farm.isActive,
          createdAt: farm.createdAt,
          updatedAt: farm.updatedAt,
          userId: farm.userId,
          createdBy: farm.createdBy || farm.userId,
          createdByName: farm.createdByName || farm.user?.firstName + ' ' + farm.user?.lastName
        };
      });
      
      setFilteredFarms(enrichedFilteredFarms);
    } catch (error) {
      console.error('Error applying filters:', error);
      // Fallback to client-side filtering if API fails
      let filtered = farms;

      if (searchTerm) {
        filtered = filtered.filter(farm =>
          (farm.name && farm.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (farm.farmName && farm.farmName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (farm.location && farm.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (farm.address && farm.address.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (selectedLocation) {
        filtered = filtered.filter(farm => 
          farm.location && farm.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }

      if (minAcres) {
        filtered = filtered.filter(farm => farm.area >= parseFloat(minAcres));
      }

      if (maxAcres) {
        filtered = filtered.filter(farm => farm.area <= parseFloat(maxAcres));
      }

      setFilteredFarms(filtered);
      toast.warn('Using offline filtering due to connection issues');
    } finally {
      setIsFiltering(false);
    }
  }, [searchTerm, selectedLocation, minAcres, maxAcres, farms]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setMinAcres('');
    setMaxAcres('');
  };

  const fetchUserFarms = async () => {
    try {
      setLoading(true);
      
      // Fetch both farms and fields data in parallel
      const [farmsResponse, fieldsResponse] = await Promise.all([
        farmService.getAll(),
        fieldService.getAll()
      ]);
      
      const allFarms = farmsResponse.data || [];
      const allFields = fieldsResponse.data || [];
      
      // Enrich farms with field counts and other calculated data
      const enrichedFarms = allFarms.map(farm => {
        // Count fields belonging to this farm
        const farmFields = allFields.filter(field => field.farmId === farm.farmId);
        const fieldsCount = farmFields.length;
        
        // Calculate total field area for this farm
        const totalFieldArea = farmFields.reduce((sum, field) => sum + (field.sizeAcres || 0), 0);
        
        return {
          ...farm,
          // Map API response properties to expected component properties
          id: farm.farmId,
          name: farm.farmName,
          location: farm.location || farm.address || 'No location specified',
          area: farm.totalAcres || totalFieldArea || 0,
          fieldsCount: fieldsCount,
          cropsCount: farm.cropsCount || 0, // This might need to be calculated from a crops API later
          // Keep original properties
          farmId: farm.farmId,
          farmName: farm.farmName,
          totalAcres: farm.totalAcres,
          isActive: farm.isActive,
          createdAt: farm.createdAt,
          updatedAt: farm.updatedAt,
          userId: farm.userId,
          createdBy: farm.createdBy || farm.userId,
          createdByName: farm.createdByName || farm.user?.firstName + ' ' + farm.user?.lastName
        };
      });
      
      setFarms(enrichedFarms);
      setFilteredFarms(enrichedFarms);
    } catch (error) {
      console.error('Error fetching user farms:', error);
      handleApiError(error); // Use server status context error handler
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Farms',
        text: 'Unable to load your farms. Please check your connection.',
        confirmButtonColor: '#16a34a'
      });
      // Fallback to empty array
      setFarms([]);
      setFilteredFarms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarm = async (farm) => {
    // Check if user owns this farm
    if (!isOwnedByCurrentUser(farm)) {
      toast.error('You can only delete farms that you created.');
      return;
    }

    // Check if farm has fields
    if (farm.fieldsCount > 0) {
      const result = await Swal.fire({
        title: 'Farm has fields',
        text: `This farm has ${farm.fieldsCount} field${farm.fieldsCount === 1 ? '' : 's'}. You need to delete all fields first before deleting the farm.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'View Fields',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Navigate to fields view with farm filter
        window.location.href = `/user-dashboard/my-fields?farm=${farm.farmId}`;
      }
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Farm',
      text: `Are you sure you want to delete "${farm.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await farmService.delete(farm.farmId || farm.id);
        toast.success('Farm deleted successfully!');
        fetchUserFarms(); // Refresh the list with updated field counts
      } catch (error) {
        console.error('Error deleting farm:', error);
        
        // Provide more specific error messages based on the error
        if (error.response?.status === 500) {
          toast.error('Cannot delete farm. Please ensure all associated fields and crops are deleted first.');
        } else if (error.response?.status === 404) {
          toast.error('Farm not found or already deleted.');
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to delete this farm.');
        } else {
          toast.error('Unable to delete the farm. Please try again later.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your farms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Farms</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your farming operations</p>
        </div>
        <Link
          to="/user-dashboard/my-farms/add"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Farm
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farms by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* Size Range Filters */}
            <input
              type="number"
              placeholder="Min Size (acres)"
              value={minAcres}
              onChange={(e) => setMinAcres(e.target.value)}
              min="0"
              step="0.1"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <input
              type="number"
              placeholder="Max Size (acres)"
              value={maxAcres}
              onChange={(e) => setMaxAcres(e.target.value)}
              min="0"
              step="0.1"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isFiltering && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Filtering...
                </div>
              )}
              <span className="text-sm text-gray-600">
                {filteredFarms.length} farm{filteredFarms.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {(searchTerm || selectedLocation || minAcres || maxAcres) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Wheat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No farms found</h3>
          <p className="text-gray-600 mb-6">
            {(searchTerm || selectedLocation || minAcres || maxAcres) ? 'No farms match your search criteria.' : 'Get started by adding your first farm.'}
          </p>
          <Link
            to="/user-dashboard/my-farms/add"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Farm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm, index) => (
            <div key={farm.farmId || farm.id || `farm-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Farm Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <Wheat className="w-16 h-16 text-white opacity-50" />
              </div>
              
              {/* Farm Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{farm.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {farm.location || 'No location specified'}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{farm.area ? farm.area.toFixed(1) : '0'}</p>
                    <p className="text-xs text-gray-600">Total Area</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{farm.fieldsCount || 0}</p>
                    <p className="text-xs text-gray-600">Fields</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{farm.cropsCount || 0}</p>
                    <p className="text-xs text-gray-600">Crops</p>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/user-dashboard/my-farms/${farm.farmId || farm.id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  {isOwnedByCurrentUser(farm) ? (
                    <>
                      <Link
                        to={`/user-dashboard/my-farms/edit/${farm.farmId || farm.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteFarm(farm)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 text-center py-2 px-3 bg-gray-50 text-gray-500 rounded-lg text-sm">
                      <span className="text-xs">View only</span>
                    </div>
                  )}
                </div>

                {/* Created Date */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Created on {farm.createdAt ? new Date(farm.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{farms.length}</p>
            <p className="text-sm text-gray-600">Total Farms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {farms.reduce((total, farm) => total + (farm.fieldsCount || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Fields</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {farms.reduce((total, farm) => total + (farm.cropsCount || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Crops</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {farms.reduce((total, farm) => total + parseFloat(farm.area || 0), 0).toFixed(1)} acres
            </p>
            <p className="text-sm text-gray-600">Total Area</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFarmsView;
