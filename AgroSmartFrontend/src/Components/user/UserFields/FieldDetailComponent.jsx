import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Ruler,
  Home,
  Droplets,
  TreePine,
  CheckCircle,
  XCircle,
  Users,
  Wheat
} from 'lucide-react';
import { toast } from 'react-toastify';
import { userFieldService } from '../../../services/userFieldService';
import { useAuth } from '../../../contexts/AuthProvider';

const FieldDetailComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFieldData();
    }
  }, [id]);

  const fetchFieldData = async () => {
    try {
      setLoading(true);
      const response = await userFieldService.getById(id);
      setField(response.data);
    } catch (error) {
      console.error('Error fetching field data:', error);
      toast.error('Failed to load field details');
      navigate('/user-dashboard/my-fields');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${field?.fieldName}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      try {
        setDeleting(true);
        await userFieldService.delete(id);
        toast.success('Field deleted successfully!');
        navigate('/user-dashboard/my-fields');
      } catch (error) {
        console.error('Error deleting field:', error);
        toast.error('Failed to delete field');
      } finally {
        setDeleting(false);
      }
    }
  };

  const isOwnedByCurrentUser = () => {
    return field && field.farm && field.farm.userId === user?.userId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading field details...</p>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Field not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/user-dashboard/my-fields')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{field.fieldName}</h1>
            <p className="text-gray-600 mt-1">Field Details</p>
          </div>
        </div>
        
        {isOwnedByCurrentUser() && (
          <div className="flex space-x-3">
            <Link
              to={`/user-dashboard/my-fields/edit/${field.fieldId}`}
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
              <p className="text-sm font-medium text-green-600">Field Size</p>
              <p className="text-2xl font-bold text-green-900">
                {field.fieldSize ? `${field.sizeAcres} acres` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Soil Type</p>
              <p className="text-2xl font-bold text-blue-900">
                {field.soilType || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Irrigation</p>
              <p className="text-lg font-bold text-yellow-900">
                {field.irrigationType || 'None'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              {field.isActive ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Status</p>
              <p className="text-2xl font-bold text-purple-900">
                {field.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Field Name</label>
            <p className="text-lg font-semibold text-gray-900">{field.fieldName}</p>
          </div>
          
          {field.fieldSize && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Field Size</label>
              <p className="text-lg font-semibold text-gray-900">{field.fieldSize} acres</p>
            </div>
          )}

          {field.location && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
              <p className="text-gray-900">{field.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Farm Information */}
      {field.farm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Home className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Farm Information</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{field.farm.farmName}</h3>
              {field.farm.location && (
                <p className="text-gray-600 mt-1">{field.farm.location}</p>
              )}
              {field.farm.totalAcres && (
                <p className="text-sm text-gray-500 mt-1">Total farm size: {field.farm.totalAcres} acres</p>
              )}
            </div>
            <Link
              to={`/user-dashboard/my-farms/${field.farm.farmId}`}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              View Farm
            </Link>
          </div>
        </div>
      )}

      {/* Field Characteristics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <TreePine className="w-5 h-5 text-yellow-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Field Characteristics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Soil Type</label>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <TreePine className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">
                  {field.soilType || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Irrigation Type</label>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Droplets className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">
                  {field.irrigationType || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Information */}
      {field.farm && field.farm.user && (
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
              <p className="font-medium text-gray-900">{field.farm.user.firstName} {field.farm.user.lastName}</p>
              <p className="text-sm text-gray-600">{field.farm.user.email}</p>
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
            to={`/user-dashboard/my-crops?field=${field.fieldId}`}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Wheat className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">View Crops</h3>
              <p className="text-sm text-gray-600">See crops grown in this field</p>
            </div>
          </Link>
          
          {field.farm && (
            <Link
              to={`/user-dashboard/my-farms/${field.farm.farmId}`}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900">View Farm</h3>
                <p className="text-sm text-gray-600">Go to {field.farm.farmName}</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Record Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          {field.createdAt && (
            <div>
              <span className="font-medium">Created:</span> {new Date(field.createdAt).toLocaleDateString()}
            </div>
          )}
          {field.updatedAt && (
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(field.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldDetailComponent;
