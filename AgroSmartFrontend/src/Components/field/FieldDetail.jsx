import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Layers, Calendar, Edit, Trash2, 
  Plus, Sprout, MapPin, BarChart3, Eye
} from "lucide-react";
import { fieldService, farmService, fieldWiseCropService } from "../../services";
import CustomAlert from "../common/CustomAlert";

const FieldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [field, setField] = useState(null);
  const [farm, setFarm] = useState(null);
  const [fieldCrops, setFieldCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropsLoading, setCropsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  useEffect(() => {
    if (id) {
      loadFieldDetails();
      loadFieldCrops();
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

  const loadFieldDetails = async () => {
    setLoading(true);
    try {
      const response = await fieldService.getById(id);
      const fieldData = response.data;
      setField(fieldData);
      
      // Load farm details if farmId is available
      if (fieldData.farmId) {
        try {
          const farmResponse = await farmService.getById(fieldData.farmId);
          setFarm(farmResponse.data);
        } catch (farmError) {
          console.error("Error loading farm details:", farmError);
        }
      }
    } catch (error) {
      console.error("Error loading field details:", error);
      setError("Failed to load field details");
    } finally {
      setLoading(false);
    }
  };

  const loadFieldCrops = async () => {
    setCropsLoading(true);
    try {
      const response = await fieldWiseCropService.getFiltered({ fieldId: id });
      const cropsData = Array.isArray(response.data) ? response.data : [];
      setFieldCrops(cropsData);
    } catch (error) {
      console.error("Error loading field crops:", error);
    } finally {
      setCropsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/fields/edit/${id}`);
  };

  const handleDelete = async () => {
    showAlert(
      'confirm',
      'Delete Field',
      `Are you sure you want to delete "${field?.fieldName}"? This will also delete all associated crops and cannot be undone.`,
      async () => {
        try {
          await fieldService.delete(id);
          closeAlert();
          const backUrl = farm ? `/farms/${farm.farmId}/fields` : '/fields';
          navigate(backUrl, {
            state: {
              message: `Field "${field?.fieldName}" deleted successfully!`,
              type: 'success'
            }
          });
        } catch (err) {
          console.error("Error deleting field:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            `Failed to delete field "${field?.fieldName}". Please try again.`
          );
        }
      },
      true
    );
  };

  const handleAddCrop = () => {
    navigate(`/dashboard/fields/${id}/crops/add`);
  };

  const handleViewAllCrops = () => {
    navigate(`/dashboard/fields/${id}/crops`);
  };

  const handleViewCrop = (fieldCrop) => {
    navigate(`/dashboard/crops/${fieldCrop.cropId}`);
  };

  const handleEditCrop = (fieldCrop) => {
    navigate(`/dashboard/field-crops/edit/${fieldCrop.fieldWiseCropId}`);
  };

  const handleDeleteCrop = async (fieldCrop) => {
    showAlert(
      'confirm',
      'Remove Crop',
      `Are you sure you want to remove "${fieldCrop.cropName}" from this field? This action cannot be undone.`,
      async () => {
        try {
          await fieldWiseCropService.delete(fieldCrop.fieldWiseCropId);
          setFieldCrops((prev) => prev.filter((c) => c.fieldWiseCropId !== fieldCrop.fieldWiseCropId));
          closeAlert();
        } catch (err) {
          console.error("Error removing crop from field:", err);
          closeAlert();
          showAlert(
            'error',
            'Remove Failed',
            `Failed to remove crop "${fieldCrop.cropName}" from field. Please try again.`
          );
        }
      },
      true
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'fallow':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCropStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'planted':
        return 'bg-green-100 text-green-800';
      case 'growing':
        return 'bg-blue-100 text-blue-800';
      case 'harvested':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Loading field details...</div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">{error || "Field not found"}</div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/dashboard/fields")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Fields
          </button>
        </div>
      </div>
    );
  }

  const activeCrops = fieldCrops.filter(crop => 
    crop.status?.toLowerCase() === 'planted' || crop.status?.toLowerCase() === 'growing'
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => {
            const backUrl = farm ? `/farms/${farm.farmId}/fields` : '/fields';
            navigate(backUrl);
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {farm ? `${farm.farmName} Fields` : 'Fields'}
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{field.fieldName}</h1>
              <p className="text-gray-600">
                {farm ? `${farm.farmName} • ` : ''}{field.fieldType || 'Unknown Type'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Field
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Area</p>
              <p className="text-2xl font-bold text-gray-800">
                {field.areaInAcres ? Number(field.areaInAcres).toFixed(1) : '0'} acres
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Crops</p>
              <p className="text-2xl font-bold text-gray-800">{fieldCrops.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Crops</p>
              <p className="text-2xl font-bold text-gray-800">{activeCrops}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {field.status || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Field Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Field Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name
                  </label>
                  <p className="text-gray-900">{field.fieldName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm
                  </label>
                  <p className="text-gray-900">{farm?.farmName || 'Not assigned'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Type
                  </label>
                  <p className="text-gray-900">{field.fieldType || 'Not specified'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <p className="text-gray-900">
                    {field.areaInAcres ? `${Number(field.areaInAcres).toFixed(2)} acres` : 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soil Type
                  </label>
                  <p className="text-gray-900">{field.soilType || 'Not specified'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Irrigation Type
                  </label>
                  <p className="text-gray-900">{field.irrigationType || 'Not specified'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(field.status)}`}>
                    {field.status || 'Unknown'}
                  </span>
                </div>
              </div>

              {(field.latitude || field.longitude) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <p className="text-gray-900">{field.latitude || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <p className="text-gray-900">{field.longitude || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Elevation
                    </label>
                    <p className="text-gray-900">
                      {field.elevation ? `${field.elevation} ft` : 'Not specified'}
                    </p>
                  </div>
                </div>
              )}

              {field.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900">{field.description}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created Date
                </label>
                <p className="text-gray-900">
                  {field.createdAt ? new Date(field.createdAt).toLocaleDateString() : 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Field Crops Overview */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Field Crops</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCrop}
                    className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Crop
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {cropsLoading ? (
                <div className="text-center text-gray-500">Loading crops...</div>
              ) : fieldCrops.length === 0 ? (
                <div className="text-center text-gray-500">
                  <p className="mb-4">No crops planted in this field yet.</p>
                  <button
                    onClick={handleAddCrop}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Plant your first crop
                  </button>
                </div>
              ) : (
                  <div className="space-y-3">
                    {fieldCrops.slice(0, 5).map((fieldCrop) => (
                      <div
                        key={fieldCrop.fieldWiseCropId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {fieldCrop.cropName || 'Unknown Crop'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {fieldCrop.plantingDate ? 
                              `Planted: ${new Date(fieldCrop.plantingDate).toLocaleDateString()}` : 
                              'Planting date not set'
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCropStatusColor(fieldCrop.status)}`}>
                            {fieldCrop.status || 'Unknown'}
                          </span>
                          <button
                            onClick={() => handleViewCrop(fieldCrop)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Crop"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditCrop(fieldCrop)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Edit Crop Assignment"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(fieldCrop)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Remove Crop from Field"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}                  {fieldCrops.length > 5 && (
                    <button
                      onClick={handleViewAllCrops}
                      className="w-full py-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                    >
                      View all {fieldCrops.length} crops →
                    </button>
                  )}
                </div>
              )}
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

export default FieldDetail;
