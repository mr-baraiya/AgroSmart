import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Thermometer, 
  Droplets, 
  Calendar,
  Ruler,
  Wheat,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { cropService } from '../../../services/cropService';
import { useAuth } from '../../../contexts/AuthProvider';

const CropDetailComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCropData();
    }
  }, [id]);

  const fetchCropData = async () => {
    try {
      setLoading(true);
      const response = await cropService.getById(id);
      setCrop(response.data);
    } catch (error) {
      console.error('Error fetching crop data:', error);
      toast.error('Failed to load crop details');
      navigate('/user-dashboard/my-crops');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // Check ownership
    if (crop && crop.createdBy !== user?.userId && crop.userId !== user?.userId) {
      toast.error('You can only delete crops that you created.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${crop?.cropName}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      try {
        setDeleting(true);
        await cropService.delete(id);
        toast.success('Crop deleted successfully!');
        navigate('/user-dashboard/my-crops');
      } catch (error) {
        console.error('Error deleting crop:', error);
        toast.error('Failed to delete crop');
      } finally {
        setDeleting(false);
      }
    }
  };

  const isOwnedByCurrentUser = () => {
    return crop && (crop.createdBy === user?.userId || crop.userId === user?.userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crop details...</p>
        </div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Crop not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/user-dashboard/my-crops')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{crop.cropName}</h1>
            <p className="text-gray-600 mt-1">Crop Details</p>
          </div>
        </div>
        
        {isOwnedByCurrentUser() && (
          <div className="flex space-x-3">
            <Link
              to={`/user-dashboard/my-crops/edit/${crop.cropId}`}
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

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Wheat className="w-5 h-5 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Crop Name</label>
            <p className="text-lg font-semibold text-gray-900">{crop.cropName}</p>
          </div>
          
          {crop.harvestSeason && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Harvest Season</label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900">{crop.harvestSeason}</p>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
            <div className="flex items-center">
              {crop.isActive ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium">Inactive</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Soil Conditions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="w-5 h-5 bg-green-600 rounded mr-2"></div>
          <h2 className="text-lg font-semibold text-gray-900">Soil Conditions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(crop.optimalSoilpHmin || crop.optimalSoilpHmax) && (
            <div className="bg-green-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-green-700 mb-2">Optimal Soil pH Range</label>
              <p className="text-2xl font-bold text-green-800">
                {crop.optimalSoilpHmin || 'N/A'} - {crop.optimalSoilpHmax || 'N/A'}
              </p>
              <p className="text-sm text-green-600 mt-1">pH Units</p>
            </div>
          )}
        </div>
      </div>

      {/* Temperature Requirements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Thermometer className="w-5 h-5 text-orange-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Temperature Requirements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(crop.optimalTempMin || crop.optimalTempMax) && (
            <div className="bg-orange-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-orange-700 mb-2">Optimal Temperature Range</label>
              <p className="text-2xl font-bold text-orange-800">
                {crop.optimalTempMin || 'N/A'}° - {crop.optimalTempMax || 'N/A'}°C
              </p>
              <p className="text-sm text-orange-600 mt-1">Celsius</p>
            </div>
          )}
        </div>
      </div>

      {/* Growing Conditions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Droplets className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Growing Conditions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {crop.avgWaterReqmm && (
            <div className="bg-blue-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-700 mb-2">Water Requirement</label>
              <p className="text-xl font-bold text-blue-800">{crop.avgWaterReqmm} mm</p>
              <p className="text-sm text-blue-600 mt-1">Average</p>
            </div>
          )}
          
          {crop.growthDurationDays && (
            <div className="bg-purple-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-purple-700 mb-2">Growth Duration</label>
              <p className="text-xl font-bold text-purple-800">{crop.growthDurationDays} days</p>
              <p className="text-sm text-purple-600 mt-1">From planting to harvest</p>
            </div>
          )}
          
          {crop.seedingDepthCm && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-yellow-700 mb-2">Seeding Depth</label>
              <p className="text-xl font-bold text-yellow-800">{crop.seedingDepthCm} cm</p>
              <p className="text-sm text-yellow-600 mt-1">Recommended depth</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {crop.description && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
          </div>
          
          <p className="text-gray-700 leading-relaxed">{crop.description}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Record Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          {crop.createdAt && (
            <div>
              <span className="font-medium">Created:</span> {new Date(crop.createdAt).toLocaleDateString()}
            </div>
          )}
          {crop.updatedAt && (
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(crop.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDetailComponent;
