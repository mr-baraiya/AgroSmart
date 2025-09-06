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
  BarChart3,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { fieldService } from '../../../services/fieldService';
import { farmService } from '../../../services/farmService';
import { useAuth } from '../../../contexts/AuthProvider';

const UserFieldsView = () => {
  const { user } = useAuth();
  const [fields, setFields] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarm, setSelectedFarm] = useState('');
  const [filteredFields, setFilteredFields] = useState([]);

  // Helper function to check if current user owns the field
  const isOwnedByCurrentUser = (field) => {
    return field.createdBy === user?.userId || field.userId === user?.userId;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    let filtered = fields;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(field =>
        (field.name && field.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (field.location && field.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (field.farmName && field.farmName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected farm
    if (selectedFarm) {
      filtered = filtered.filter(field => field.farmId === selectedFarm);
    }

    setFilteredFields(filtered);
  }, [searchTerm, selectedFarm, fields]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [fieldsResponse, farmsResponse] = await Promise.all([
        fieldService.getAll(),
        farmService.getAll()
      ]);
      
      const allFields = fieldsResponse.data || [];
      const allFarms = farmsResponse.data || [];
      
      setFields(allFields);
      setFarms(allFarms);
      setFilteredFields(allFields);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Fields',
        text: 'Unable to load your fields. Please try again.',
        confirmButtonColor: '#16a34a'
      });
      setFields([]);
      setFarms([]);
      setFilteredFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteField = async (field) => {
    // Check if user owns this field
    if (!isOwnedByCurrentUser(field)) {
      toast.error('You can only delete fields that you created.');
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Field',
      text: `Are you sure you want to delete "${field.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await fieldService.delete(field.id);
        toast.success('Field deleted successfully!');
        fetchUserData(); // Refresh the list
      } catch (error) {
        console.error('Error deleting field:', error);
        toast.error('Unable to delete the field. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Fields</h1>
          <p className="text-gray-600 mt-1">Manage your individual field operations</p>
        </div>
        <Link
          to="/user-dashboard/my-fields/add"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Field
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
                placeholder="Search fields by name, location, or farm..."
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
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 mr-2 text-gray-400" />
            More Filters
          </button>
        </div>
      </div>

      {/* Fields Grid */}
      {filteredFields.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedFarm ? 'No fields match your search criteria.' : 'Get started by adding your first field.'}
          </p>
          <Link
            to="/user-dashboard/my-fields/add"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Field
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field, index) => (
            <div key={field.id || `field-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Field Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-white opacity-50" />
              </div>
              
              {/* Field Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{field.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {field.location || 'No location specified'}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {field.farmName || 'Unknown Farm'}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{field.area || '0'}</p>
                    <p className="text-xs text-gray-600">Area (acres)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{field.cropsCount || 0}</p>
                    <p className="text-xs text-gray-600">Crops</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{field.soilType || 'N/A'}</p>
                    <p className="text-xs text-gray-600">Soil Type</p>
                  </div>
                </div>

                {/* Owner Info */}
                {field.createdByName && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      <User className="w-4 h-4 mr-2" />
                      Created by: {field.createdByName}
                      {isOwnedByCurrentUser(field) && (
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
                    to={`/user-dashboard/my-fields/${field.id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  {isOwnedByCurrentUser(field) ? (
                    <>
                      <Link
                        to={`/user-dashboard/my-fields/edit/${field.id}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteField(field)}
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
                    Created on {field.createdAt ? new Date(field.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fields Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{fields.length}</p>
            <p className="text-sm text-gray-600">Total Fields</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {fields.reduce((total, field) => total + (field.cropsCount || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Crops</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {fields.reduce((total, field) => total + parseFloat(field.area || 0), 0).toFixed(1)} acres
            </p>
            <p className="text-sm text-gray-600">Total Area</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{farms.length}</p>
            <p className="text-sm text-gray-600">Farms Used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFieldsView;
