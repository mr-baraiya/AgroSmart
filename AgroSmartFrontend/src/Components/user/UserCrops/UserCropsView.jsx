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
import { fieldService } from '../../../services/fieldService';
import { farmService } from '../../../services/farmService';
import { useAuth } from '../../../contexts/AuthProvider';

const UserCropsView = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [fields, setFields] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);

  // Helper function to check if current user owns the crop
  const isOwnedByCurrentUser = (crop) => {
    return crop.createdBy === user?.userId || crop.userId === user?.userId;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    let filtered = crops;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crop =>
        (crop.name && crop.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (crop.variety && crop.variety.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (crop.fieldName && crop.fieldName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (crop.farmName && crop.farmName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected farm
    if (selectedFarm) {
      filtered = filtered.filter(crop => crop.farmId === selectedFarm);
    }

    // Filter by selected field
    if (selectedField) {
      filtered = filtered.filter(crop => crop.fieldId === selectedField);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(crop => crop.status === selectedStatus);
    }

    setFilteredCrops(filtered);
  }, [searchTerm, selectedField, selectedFarm, selectedStatus, crops]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [cropsResponse, fieldsResponse, farmsResponse] = await Promise.all([
        cropService.getAll(),
        fieldService.getAll(),
        farmService.getAll()
      ]);
      
      const allCrops = cropsResponse.data || [];
      const allFields = fieldsResponse.data || [];
      const allFarms = farmsResponse.data || [];
      
      setCrops(allCrops);
      setFields(allFields);
      setFarms(allFarms);
      setFilteredCrops(allCrops);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Unable to load your crops. Please try again.');
      setCrops([]);
      setFields([]);
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

    const result = window.confirm(`Are you sure you want to delete "${crop.name}"? This action cannot be undone.`);

    if (result) {
      try {
        await cropService.delete(crop.id);
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
                placeholder="Search crops, varieties, fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Farms</option>
            {farms.map((farm, index) => (
              <option key={farm.id || `farm-${index}`} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Fields</option>
            {fields.filter(field => !selectedFarm || field.farmId === selectedFarm).map((field, index) => (
              <option key={field.id || `field-${index}`} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="planted">Planted</option>
            <option value="growing">Growing</option>
            <option value="harvesting">Harvesting</option>
            <option value="harvested">Harvested</option>
          </select>
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedField || selectedFarm || selectedStatus ? 'No crops match your search criteria.' : 'Get started by adding your first crop.'}
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
            <div key={crop.id || `crop-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Crop Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                <Wheat className="w-16 h-16 text-white opacity-50" />
              </div>
              
              {/* Crop Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{crop.name}</h3>
                    {crop.variety && (
                      <p className="text-sm text-gray-600 mb-1">{crop.variety}</p>
                    )}
                    <div className="text-sm text-green-600 font-medium">
                      {crop.fieldName || 'Unknown Field'} • {crop.farmName || 'Unknown Farm'}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(crop.status)}`}>
                    {crop.status?.charAt(0).toUpperCase() + crop.status?.slice(1) || 'Unknown'}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{crop.area || '0'}</p>
                    <p className="text-xs text-gray-600">Area (acres)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {crop.harvestingDate ? getDaysUntilHarvest(crop.plantingDate, crop.harvestingDate) || 'Ready' : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">Days to Harvest</p>
                  </div>
                </div>

                {/* Dates */}
                {crop.plantingDate && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Planted: {new Date(crop.plantingDate).toLocaleDateString()}
                    </div>
                    {crop.harvestingDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Expected Harvest: {new Date(crop.harvestingDate).toLocaleDateString()}
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
                    to={`/user-dashboard/my-crops/${crop.id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  {isOwnedByCurrentUser(crop) ? (
                    <>
                      <Link
                        to={`/user-dashboard/my-crops/edit/${crop.id}`}
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
