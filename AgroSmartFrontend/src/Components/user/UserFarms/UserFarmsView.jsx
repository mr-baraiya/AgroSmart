import React, { useState, useEffect } from 'react';
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
import { useServerStatusContext } from '../../../contexts/ServerStatusProvider';
import { useAuth } from '../../../contexts/AuthProvider';

const UserFarmsView = () => {
  const { user } = useAuth();
  const { isServerOnline, isInitialCheck, handleApiError } = useServerStatusContext();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFarms, setFilteredFarms] = useState([]);

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

  useEffect(() => {
    const filtered = farms.filter(farm =>
      (farm.name && farm.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (farm.location && farm.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredFarms(filtered);
  }, [searchTerm, farms]);

  const fetchUserFarms = async () => {
    try {
      setLoading(true);
      const response = await farmService.getAll();
      const allFarms = response.data || [];
      
      // For now, show all farms (later you can filter by current user)
      setFarms(allFarms);
      setFilteredFarms(allFarms);
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
        fetchUserFarms(); // Refresh the list
      } catch (error) {
        console.error('Error deleting farm:', error);
        toast.error('Unable to delete the farm. Please try again.');
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farms by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 mr-2 text-gray-400" />
            Filters
          </button>
        </div>
      </div>

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Wheat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No farms found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No farms match your search criteria.' : 'Get started by adding your first farm.'}
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
                    <p className="text-2xl font-bold text-gray-900">{farm.area || '0'}</p>
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

                {/* Owner Info */}
                {farm.createdByName && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      <User className="w-4 h-4 mr-2" />
                      Created by: {farm.createdByName}
                      {isOwnedByCurrentUser(farm) && (
                        <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                )}

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
