import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Ruler,
  Home,
  Globe,
  CheckCircle,
  XCircle,
  Users,
  Wheat
} from 'lucide-react';
import { toast } from 'react-toastify';
import { farmService } from '../../../services/farmService';
import { useAuth } from '../../../contexts/AuthProvider';

const FarmDetailComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    console.log('🔍 FarmDetailComponent useEffect - ID:', id, 'Type:', typeof id);
    if (id && id !== 'undefined') {
      fetchFarmData();
    } else {
      console.warn('⚠️ Invalid or missing farm ID:', id);
      toast.error('Invalid farm ID');
      navigate('/user-dashboard/my-farms');
    }
  }, [id]);

  const fetchFarmData = async () => {
    // Don't fetch if ID is undefined or null
    if (!id || id === 'undefined') {
      console.warn('Farm ID is undefined, skipping fetch');
      toast.error('Invalid farm ID');
      navigate('/user-dashboard/my-farms');
      return;
    }

    try {
      setLoading(true);
      const response = await farmService.getById(id);
      setFarm(response.data);
    } catch (error) {
      console.error('Error fetching farm data:', error);
      toast.error('Failed to load farm details');
      navigate('/user-dashboard/my-farms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // Check ownership
    if (farm && farm.userId !== user?.userId) {
      toast.error('You can only delete farms that you created.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${farm?.farmName}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      try {
        setDeleting(true);
        await farmService.delete(id);
        toast.success('Farm deleted successfully!');
        navigate('/user-dashboard/my-farms');
      } catch (error) {
        console.error('Error deleting farm:', error);
        toast.error('Failed to delete farm');
      } finally {
        setDeleting(false);
      }
    }
  };

  const isOwnedByCurrentUser = () => {
    return farm && farm.userId === user?.userId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farm details...</p>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Farm not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/user-dashboard/my-farms')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{farm.farmName}</h1>
            <p className="text-gray-600 mt-1">Farm Details</p>
          </div>
        </div>
        
        {isOwnedByCurrentUser() && (
          <div className="flex space-x-3">
            <Link
              to={`/user-dashboard/my-farms/edit/${farm.farmId}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Area</p>
              <p className="text-2xl font-bold text-green-900">
                {farm.totalAcres ? `${farm.totalAcres} acres` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Fields</p>
              <p className="text-2xl font-bold text-blue-900">
                {farm.fieldsCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Crops</p>
              <p className="text-2xl font-bold text-yellow-900">
                {farm.cropsCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              {farm.isActive ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Status</p>
              <p className="text-2xl font-bold text-purple-900">
                {farm.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Home className="w-5 h-5 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Farm Name</label>
            <p className="text-lg font-semibold text-gray-900">{farm.farmName}</p>
          </div>
          
          {farm.totalAcres && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Area</label>
              <p className="text-lg font-semibold text-gray-900">{farm.totalAcres} acres</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Address</label>
            <p className="text-gray-900">{farm.location}</p>
          </div>

          {(farm.latitude || farm.longitude) && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">GPS Coordinates</label>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Globe className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Coordinates</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {farm.latitude && (
                    <div>
                      <span className="font-medium text-blue-700">Latitude:</span>
                      <span className="ml-2 text-blue-600">{farm.latitude}°</span>
                    </div>
                  )}
                  {farm.longitude && (
                    <div>
                      <span className="font-medium text-blue-700">Longitude:</span>
                      <span className="ml-2 text-blue-600">{farm.longitude}°</span>
                    </div>
                  )}
                </div>
                {farm.latitude && farm.longitude && (
                  <div className="mt-3">
                    <a
                      href={`https://www.google.com/maps?q=${farm.latitude},${farm.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Owner Information */}
      {farm.user && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Users className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Owner Information</h2>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">{farm.user.firstName} {farm.user.lastName}</p>
              <p className="text-sm text-gray-600">{farm.user.email}</p>
            </div>
            {isOwnedByCurrentUser() && (
              <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                You
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to={`/user-dashboard/my-fields?farm=${farm.farmId}`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">View Fields</h3>
              <p className="text-sm text-gray-600">Manage fields in this farm</p>
            </div>
          </Link>
          
          <Link
            to={`/user-dashboard/my-crops?farm=${farm.farmId}`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Wheat className="w-8 h-8 text-yellow-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">View Crops</h3>
              <p className="text-sm text-gray-600">See crops grown on this farm</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Record Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          {farm.createdAt && (
            <div>
              <span className="font-medium">Created:</span> {new Date(farm.createdAt).toLocaleDateString()}
            </div>
          )}
          {farm.updatedAt && (
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(farm.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmDetailComponent;
