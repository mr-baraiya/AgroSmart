import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Sprout, Calendar, Thermometer, Droplets, Clock, Ruler, Eye, EyeOff } from "lucide-react";
import { cropService } from "../../services";
import CustomAlert from "../common/CustomAlert";

const CropDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Load crop data
  useEffect(() => {
    const loadCrop = async () => {
      setLoading(true);
      setApiError(null);
      try {
        console.log('Loading crop with ID:', id);
        
        if (!id || id === 'undefined' || id === 'null') {
          throw new Error('Invalid crop ID');
        }
        
        const response = await cropService.getById(id);
        console.log('Crop data received:', response.data);
        
        const cropData = response.data;
        
        if (!cropData) {
          throw new Error('Crop not found');
        }
        
        setCrop(cropData);
      } catch (err) {
        console.error('Error loading crop:', err);
        let errorMessage = "Failed to load crop data";
        
        if (err.response?.status === 404) {
          errorMessage = "Crop not found. It may have been deleted.";
        } else if (err.response?.status === 403) {
          errorMessage = "You don't have permission to access this crop.";
        } else if (err.response?.status === 401) {
          errorMessage = "Please log in to access this crop.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCrop();
    }
  }, [id]);

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

  // Handle delete
  const handleDelete = () => {
    showAlert(
      'confirm',
      'Delete Crop',
      `Are you sure you want to delete "${crop?.cropName}"? This action cannot be undone.`,
      async () => {
        try {
          await cropService.delete(id);
          closeAlert();
          navigate('/crops', { 
            state: { 
              message: `Crop "${crop?.cropName}" deleted successfully!`,
              type: 'success'
            }
          });
        } catch (error) {
          console.error('Error deleting crop:', error);
          showAlert(
            'error',
            'Delete Failed',
            error.response?.data?.message || 'Failed to delete crop. Please try again.'
          );
        }
      },
      true
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading crop details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiError || !crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Crop Not Found</h2>
          <p className="text-gray-600 mb-8">{apiError || "The requested crop could not be found."}</p>
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate('/crops')}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Back to Crops
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Info card component
  const InfoCard = ({ icon: Icon, title, value, unit = "", description, color = "gray" }) => {
    const colorClasses = {
      green: "from-green-500 to-emerald-500",
      blue: "from-blue-500 to-cyan-500",
      orange: "from-orange-500 to-red-500",
      purple: "from-purple-500 to-pink-500",
      gray: "from-gray-500 to-slate-600",
      yellow: "from-yellow-500 to-amber-500"
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className={`p-3 bg-gradient-to-r ${colorClasses[color]} rounded-xl mr-4`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {value !== null && value !== undefined && value !== '' ? (
            <>
              {value} {unit}
            </>
          ) : (
            <span className="text-gray-400 text-lg">Not specified</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => navigate('/crops')}
                className="mr-4 p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mr-4">
                  <Sprout className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {crop.cropName}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-500">
                      Harvest Season: {crop.harvestSeason || 'Not specified'}
                    </p>
                    <div className="flex items-center gap-1">
                      {crop.isActive ? (
                        <>
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-400">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/crops/edit/${id}`)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <Edit className="w-5 h-5" />
                Edit Crop
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">{crop.cropName}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harvest Season</label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold text-gray-900">
                    {crop.harvestSeason || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
            {crop.description && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-800 leading-relaxed">{crop.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Environmental Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Soil pH */}
            <InfoCard
              icon={Droplets}
              title="Soil pH Range"
              value={
                crop.optimalSoilpHmin !== null && crop.optimalSoilpHmax !== null
                  ? `${crop.optimalSoilpHmin} - ${crop.optimalSoilpHmax}`
                  : crop.optimalSoilpHmin !== null
                  ? `${crop.optimalSoilpHmin}+`
                  : crop.optimalSoilpHmax !== null
                  ? `Up to ${crop.optimalSoilpHmax}`
                  : null
              }
              description="Optimal soil acidity level"
              color="blue"
            />

            {/* Temperature */}
            <InfoCard
              icon={Thermometer}
              title="Temperature Range"
              value={
                crop.optimalTempMin !== null && crop.optimalTempMax !== null
                  ? `${crop.optimalTempMin}°C - ${crop.optimalTempMax}°C`
                  : crop.optimalTempMin !== null
                  ? `${crop.optimalTempMin}°C+`
                  : crop.optimalTempMax !== null
                  ? `Up to ${crop.optimalTempMax}°C`
                  : null
              }
              description="Ideal growing temperature"
              color="orange"
            />

            {/* Water Requirement */}
            <InfoCard
              icon={Droplets}
              title="Water Requirement"
              value={crop.avgWaterReqmm}
              unit="mm"
              description="Average water needed"
              color="blue"
            />

            {/* Growth Duration */}
            <InfoCard
              icon={Clock}
              title="Growth Duration"
              value={crop.growthDurationDays}
              unit="days"
              description="Seed to harvest time"
              color="purple"
            />

            {/* Seeding Depth */}
            <InfoCard
              icon={Ruler}
              title="Seeding Depth"
              value={crop.seedingDepthCm}
              unit="cm"
              description="Optimal planting depth"
              color="yellow"
            />

            {/* Status */}
            <InfoCard
              icon={crop.isActive ? Eye : EyeOff}
              title="Status"
              value={crop.isActive ? "Active" : "Inactive"}
              description="Current crop status"
              color={crop.isActive ? "green" : "gray"}
            />
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Crop Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {crop.harvestSeason || 'Various'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Harvest Season</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {crop.growthDurationDays ? `${crop.growthDurationDays} days` : 'Variable'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Growing Period</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  {crop.avgWaterReqmm ? `${crop.avgWaterReqmm}mm` : 'Variable'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Water Needs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-700">
                  {crop.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Current Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default CropDetail;
