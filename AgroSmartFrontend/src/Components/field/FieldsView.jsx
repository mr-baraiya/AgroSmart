import React, { useEffect, useState } from "react";
import { Plus, CheckCircle, XCircle, MapPin, Sprout } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fieldService, farmService } from "../../services";
import FieldTable from "./FieldTable";
import FieldFilter from "./FieldFilter";
import CustomAlert from "../common/CustomAlert";

const FieldsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { farmId } = useParams(); // Optional farm ID from URL
  
  const [fields, setFields] = useState([]);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState(farmId ? { farmId } : {});
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
    fetchFields();
    if (farmId) {
      fetchFarm();
    }
  }, [farmId]);

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

  const fetchFarm = async () => {
    if (!farmId) return;
    try {
      const response = await farmService.getById(farmId);
      setFarm(response.data);
    } catch (err) {
      console.error("Error fetching farm:", err);
    }
  };

  const fetchFields = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying field filters:', filtersToUse);
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
        console.log('Calling fieldService.getFiltered with:', filtersToUse);
        response = await fieldService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling fieldService.getAll - no filters');
        response = await fieldService.getAll();
      }
      
      const fieldsData = Array.isArray(response.data) ? response.data : [];
      console.log('Received fields data:', fieldsData.length, 'items');
      setFields(fieldsData);
    } catch (err) {
      console.error("Error fetching fields:", err);
      setError("Failed to fetch fields");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleEdit = (field) => {
    console.log('Editing field:', field);
    console.log('Field ID:', field.fieldId);
    navigate(`/fields/edit/${field.fieldId}`);
  };

  const handleAdd = () => {
    const addUrl = farmId ? `/fields/add?farmId=${farmId}` : '/fields/add';
    navigate(addUrl);
  };

  const handleDelete = async (field) => {
    showAlert(
      'confirm',
      'Delete Field',
      `Are you sure you want to delete "${field.fieldName}"? This action cannot be undone.`,
      async () => {
        try {
          await fieldService.delete(field.fieldId);
          setFields((prev) => prev.filter((f) => f.fieldId !== field.fieldId));
          closeAlert();
          setNotification({
            message: `Field "${field.fieldName}" deleted successfully!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error deleting field:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            `Failed to delete field "${field.fieldName}". Please try again.`
          );
        }
      },
      true
    );
  };

  // Navigate to the detail page
  const handleInfo = (field) => {
    navigate(`/fields/${field.fieldId}`);
  };

  // Navigate to view crops in this field
  const handleViewCrops = (field) => {
    navigate(`/fields/${field.fieldId}/crops`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFields(newFilters);
  };

  const pageTitle = farmId && farm ? `${farm.farmName} - Fields` : 'Field Management';
  const pageDescription = farmId && farm 
    ? `Manage fields in ${farm.farmName}` 
    : 'Manage your agricultural fields';

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
      {farmId && (
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate('/farms')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Farms
            </button>
            <span className="text-gray-500">/</span>
            <button 
              onClick={() => navigate(`/farms/${farmId}`)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {farm?.farmName || 'Farm'}
            </button>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700">Fields</span>
          </nav>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>
            <p className="text-gray-600">{pageDescription}</p>
          </div>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      {/* Filter Component */}
      <FieldFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
        selectedFarmId={farmId}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Results Summary */}
        {!loading && !error && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
            <span className="font-medium">
              {fields.length} field{fields.length !== 1 ? 's' : ''} found
              {Object.keys(filters).length > 0 && ' (filtered)'}
            </span>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading fields...</div>
          ) : error ? (
            <div className="p-6 text-red-500 text-center">{error}</div>
          ) : (
            <FieldTable
              fields={fields}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
              onViewCrops={handleViewCrops}
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

export default FieldsView;
