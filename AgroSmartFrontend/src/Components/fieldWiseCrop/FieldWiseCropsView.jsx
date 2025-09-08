import React, { useEffect, useState } from "react";
import { Plus, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fieldWiseCropService, fieldService, farmService } from "../../services";
import FieldWiseCropTable from "./FieldWiseCropTable";
import FieldWiseCropFilter from "./FieldWiseCropFilter";
import CustomAlert from "../common/CustomAlert";

const FieldWiseCropsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fieldId, farmId } = useParams(); // Optional field or farm ID from URL
  
  const [fieldCrops, setFieldCrops] = useState([]);
  const [field, setField] = useState(null);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState(fieldId ? { fieldId } : farmId ? { farmId } : {});
  const [filterLoading, setFilterLoading] = useState(false);
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Handle success/error messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || 'success'
      });
      
      // Clear the message from location state
      window.history.replaceState({}, document.title);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    fetchFieldCrops();
    if (fieldId) {
      fetchField();
    }
    if (farmId) {
      fetchFarm();
    }
  }, [fieldId, farmId]);

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

  const fetchField = async () => {
    if (!fieldId) return;
    try {
      const response = await fieldService.getById(fieldId);
      setField(response.data);
    } catch (err) {
      console.error("Error fetching field:", err);
    }
  };

  const fetchFarm = async () => {
    if (!farmId) return;
    try {
      const response = await farmService.getById(farmId);
      setFarm(response.data);
    } catch (err) {
      console.error("Error fetching farm:", err);
    }
  };

  const fetchFieldCrops = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying field crops filters:', filtersToUse);
    }
    
    // Use filter loading for filter operations, regular loading for initial load
    if (appliedFilters !== null) {
      setFilterLoading(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      let response;
      if (hasFilters) {
        // Use the filter API when filters are applied
        console.log('Calling fieldWiseCropService.getFiltered with:', filtersToUse);
        response = await fieldWiseCropService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling fieldWiseCropService.getAll - no filters');
        response = await fieldWiseCropService.getAll();
      }
      
      const cropsData = Array.isArray(response.data) ? response.data : [];
      console.log('Received field crops data:', cropsData.length, 'items');
      setFieldCrops(cropsData);
    } catch (err) {
      console.error("Error fetching field crops:", err);
      setError("Failed to fetch field crops");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleEdit = (fieldCrop) => {
    console.log('Editing field crop:', fieldCrop);
    navigate(`/field-crops/edit/${fieldCrop.fieldWiseCropId}`);
  };

  const handleAdd = () => {
    const addUrl = fieldId ? `/field-crops/add?fieldId=${fieldId}` : '/field-crops/add';
    navigate(addUrl);
  };

  const handleDelete = async (fieldCrop) => {
    showAlert(
      'confirm',
      'Remove Crop from Field',
      `Are you sure you want to remove "${fieldCrop.cropName}" from "${fieldCrop.fieldName}"? This action cannot be undone.`,
      async () => {
        try {
          await fieldWiseCropService.delete(fieldCrop.fieldWiseCropId);
          setFieldCrops((prev) => prev.filter((fc) => fc.fieldWiseCropId !== fieldCrop.fieldWiseCropId));
          closeAlert();
          setNotification({
            message: `Crop "${fieldCrop.cropName}" removed from field successfully!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
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

  // Navigate to the detail page
  const handleInfo = (fieldCrop) => {
    navigate(`/field-crops/${fieldCrop.fieldWiseCropId}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFieldCrops(newFilters);
  };

  const handleBack = () => {
    if (fieldId && field) {
      navigate(`/dashboard/fields/${fieldId}`);
    } else if (farmId && farm) {
      navigate(`/dashboard/farms/${farmId}`);
    } else {
      navigate('/dashboard/fields');
    }
  };

  const pageTitle = fieldId && field ? `${field.fieldName} - Crops` 
    : farmId && farm ? `${farm.farmName} - All Crops`
    : 'Field Crops Management';
  
  const pageDescription = fieldId && field 
    ? `Manage crops in ${field.fieldName}` 
    : farmId && farm 
    ? `All crops planted across ${farm.farmName}`
    : 'Manage crop assignments to fields';

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {fieldId ? 'Field Details' : farmId ? 'Farm Details' : 'Fields'}
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>
          <p className="text-gray-600">{pageDescription}</p>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Plant Crop
        </button>
      </div>

      {/* Filter Component */}
      <FieldWiseCropFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
        selectedFieldId={fieldId}
        selectedFarmId={farmId}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Results Summary */}
        {!loading && !error && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
            <span className="font-medium">
              {fieldCrops.length} crop assignment{fieldCrops.length !== 1 ? 's' : ''} found
              {Object.keys(filters).length > 0 && ' (filtered)'}
            </span>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading field crops...</div>
          ) : error ? (
            <div className="p-6 text-red-500 text-center">{error}</div>
          ) : (
            <FieldWiseCropTable
              fieldCrops={fieldCrops}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
            />
          )}
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
        confirmText={alert.type === 'confirm' ? 'Remove' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default FieldWiseCropsView;
