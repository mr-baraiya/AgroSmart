import React, { useEffect, useState } from "react";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cropService } from "../../services";
import CropTable from "./CropTable";
import CropFilter from "./CropFilter";
import CustomAlert from "../common/CustomAlert";

const CropsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({});
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
    fetchCrops();
  }, []);

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

  const fetchCrops = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying filters:', filtersToUse);
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
        console.log('Calling getFiltered with:', filtersToUse);
        response = await cropService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling getAll - no filters');
        response = await cropService.getAll();
      }
      
      const cropsData = Array.isArray(response.data) ? response.data : [];
      console.log('Received crops data:', cropsData.length, 'items');
      setCrops(cropsData);
    } catch (err) {
      console.error("Error fetching crops:", err);
      setError("Failed to fetch crops");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleEdit = (crop) => {
    console.log('Editing crop:', crop);
    console.log('Crop ID:', crop.cropId);
    navigate(`/crops/edit/${crop.cropId}`);
  };

  const handleAdd = () => {
    navigate('/crops/add');
  };

  const handleDelete = async (crop) => {
    showAlert(
      'confirm',
      'Delete Crop',
      `Are you sure you want to delete "${crop.cropName}"? This action cannot be undone.`,
      async () => {
        try {
          await cropService.delete(crop.cropId);
          setCrops((prev) => prev.filter((c) => c.cropId !== crop.cropId));
          closeAlert();
          setNotification({
            message: `Crop "${crop.cropName}" deleted successfully!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error deleting crop:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            `Failed to delete crop "${crop.cropName}". Please try again.`
          );
        }
      },
      true
    );
  };

  // Navigate to the detail page
  const handleInfo = (crop) => {
    navigate(`/crops/${crop.cropId}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchCrops(newFilters);
  };

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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crop Management</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Add Crop
        </button>
      </div>

      {/* Filter Component */}
      <CropFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Results Summary */}
        {!loading && !error && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
            <span className="font-medium">
              {crops.length} crop{crops.length !== 1 ? 's' : ''} found
              {Object.keys(filters).length > 0 && ' (filtered)'}
            </span>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading crops...</div>
          ) : error ? (
            <div className="p-6 text-red-500 text-center">{error}</div>
          ) : (
            <CropTable
              crops={crops}
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
        confirmText={alert.type === 'confirm' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default CropsView;