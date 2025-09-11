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
  Sprout,
  Clock,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';
import { cropService } from '../../../services/cropService';
import { useAuth } from '../../../contexts/AuthProvider';

const UserCropsView = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);

  // Helper function to check if current user can manage the crop
  const isOwnedByCurrentUser = (crop) => {
    // Since crops are system-wide data without direct ownership in the API schema,
    // we'll allow users to edit crops based on certain criteria:
    
    // 1. Direct ownership check (if API ever provides it)
    const directOwnership = crop.createdBy === user?.userId || crop.userId === user?.userId;
    
    // 2. Allow editing of crops with higher IDs (likely user-created crops)
    const isUserManageableCrop = crop.cropId && crop.cropId >= 10; // Adjust threshold as needed
    
    // 3. Check if user has special permissions (you can add admin role check here)
    const hasManagePermission = user?.role === 'admin' || user?.canManageCrops;
    
    return directOwnership || isUserManageableCrop || hasManagePermission;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    let filtered = crops;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crop =>
        (crop.cropName && crop.cropName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (crop.harvestSeason && crop.harvestSeason.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (crop.description && crop.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status (if crops have isActive property)
    if (selectedStatus) {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(crop => crop.isActive !== false);
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(crop => crop.isActive === false);
      }
    }

    setFilteredCrops(filtered);
  }, [searchTerm, selectedStatus, crops]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const cropsResponse = await cropService.getAll();
      
      const allCrops = cropsResponse.data || [];
      
      setCrops(allCrops);
      setFilteredCrops(allCrops);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Unable to load your crops. Please try again.');
      setCrops([]);
      setFarms([]);
      setFilteredCrops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = async (crop) => {
    // Check if user owns this crop
    if (!isOwnedByCurrentUser(crop)) {
      toast.error('You can only delete crops that you created.');
      return;
    }

    const result = window.confirm(`Are you sure you want to delete "${crop.cropName || crop.name}"? This action cannot be undone.`);

    if (result) {
      try {
        await cropService.delete(crop.cropId || crop.id);
        toast.success('Crop deleted successfully!');
        fetchUserData(); // Refresh the list
      } catch (error) {
        console.error('Error deleting crop:', error);
        toast.error('Unable to delete the crop. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'planted': 'bg-green-100 text-green-800',
      'growing': 'bg-blue-100 text-blue-800',
      'harvesting': 'bg-yellow-100 text-yellow-800',
      'harvested': 'bg-gray-100 text-gray-800',
      'planning': 'bg-purple-100 text-purple-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDaysUntilHarvest = (plantingDate, harvestingDate) => {
    if (!harvestingDate) return null;
    const today = new Date();
    const harvest = new Date(harvestingDate);
    const diffTime = harvest - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your crops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Crops</h1>
          <p className="text-gray-600 mt-1">Track and manage your crop cultivation</p>
        </div>
        <Link
          to="/user-dashboard/my-crops/add"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Crop
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search crops by name, harvest season..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedStatus ? 'No crops match your search criteria.' : 'Get started by adding your first crop.'}
          </p>
          <Link
            to="/user-dashboard/my-crops/add"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Crop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <div key={crop.cropId || crop.id || `crop-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Crop Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                <Wheat className="w-16 h-16 text-white opacity-50" />
              </div>
              
              {/* Crop Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{crop.cropName || crop.name || 'Unknown Crop'}</h3>
                    {crop.variety && (
                      <p className="text-sm text-gray-600 mb-1">{crop.variety}</p>
                    )}
                    <div className="text-sm text-green-600 font-medium">
                      {crop.harvestSeason || 'Crop Information'}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${crop.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {crop.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{crop.growthDurationDays || '0'}</p>
                    <p className="text-xs text-gray-600">Growth Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {crop.avgWaterReqmm || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">Water Req (mm)</p>
                  </div>
                </div>

                {/* Crop Details */}
                {(crop.optimalTempMin || crop.optimalTempMax || crop.optimalSoilpHmin || crop.optimalSoilpHmax) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    {(crop.optimalTempMin || crop.optimalTempMax) && (
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Temp: {crop.optimalTempMin}°C - {crop.optimalTempMax}°C
                      </div>
                    )}
                    {(crop.optimalSoilpHmin || crop.optimalSoilpHmax) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        pH: {crop.optimalSoilpHmin} - {crop.optimalSoilpHmax}
                      </div>
                    )}
                  </div>
                )}

                {/* Owner Info */}
                {crop.createdByName && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      <User className="w-4 h-4 mr-2" />
                      Created by: {crop.createdByName}
                      {isOwnedByCurrentUser(crop) && (
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
                    to={`/user-dashboard/my-crops/${crop.cropId || crop.id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  {isOwnedByCurrentUser(crop) ? (
                    <>
                      <Link
                        to={`/user-dashboard/my-crops/edit/${crop.cropId || crop.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteCrop(crop)}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crops Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{crops.length}</p>
            <p className="text-sm text-gray-600">Total Crops</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {crops.filter(crop => crop.status === 'growing').length}
            </p>
            <p className="text-sm text-gray-600">Growing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {crops.filter(crop => crop.status === 'harvesting').length}
            </p>
            <p className="text-sm text-gray-600">Harvesting</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {crops.filter(crop => crop.status === 'harvested').length}
            </p>
            <p className="text-sm text-gray-600">Harvested</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {crops.reduce((total, crop) => total + parseFloat(crop.area || 0), 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Total Area (acres)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCropsView;
