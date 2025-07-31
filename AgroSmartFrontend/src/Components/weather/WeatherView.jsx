import React, { useEffect, useState } from "react";
import { Plus, Cloud, Sun, CloudRain, Wind } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { weatherService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import WeatherTable from "./WeatherTable";
import WeatherFilter from "./WeatherFilter";
import CustomAlert from "../common/CustomAlert";

const WeatherView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);
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
    // Only fetch weather data after initial server status check is complete
    if (!isInitialCheck) {
      console.log('🚀 Initial server check complete, fetching weather data...');
      fetchWeatherData();
    }
  }, [isInitialCheck]);

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

  const fetchWeatherData = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying weather filters:', filtersToUse);
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
        response = await weatherService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling getAll - no filters');
        response = await weatherService.getAll();
      }
      
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Received weather data:', data.length, 'items');
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      const apiResponse = handleApiError(err);
      if (apiResponse.isServerDown) {
        setIsServerError(true);
        setError('Backend server is currently offline. Please check your connection and try again.');
      } else {
        setError(apiResponse.message);
      }
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleEdit = (weather) => {
    console.log('Editing weather data:', weather);
    console.log('Weather ID:', weather.weatherId);
    navigate(`/weather/edit/${weather.weatherId}`);
  };

  const handleAdd = () => {
    navigate('/weather/add');
  };

  const handleDelete = async (weather) => {
    showAlert(
      'confirm',
      'Delete Weather Data',
      `Are you sure you want to delete weather data for "${weather.location}"? This action cannot be undone.`,
      async () => {
        try {
          await weatherService.delete(weather.weatherId);
          setWeatherData((prev) => prev.filter((w) => w.weatherId !== weather.weatherId));
          closeAlert();
          setNotification({
            message: `Weather data for "${weather.location}" deleted successfully!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error deleting weather data:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            `Failed to delete weather data for "${weather.location}". Please try again.`
          );
        }
      },
      true
    );
  };

  // Navigate to the detail page
  const handleInfo = (weather) => {
    navigate(`/weather/${weather.weatherId}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchWeatherData(newFilters);
  };

  // Get weather icon based on description
  const getWeatherIcon = () => {
    const hasRain = weatherData.some(w => 
      w.weatherDescription?.toLowerCase().includes('rain') || 
      w.weatherDescription?.toLowerCase().includes('storm')
    );
    const hasClouds = weatherData.some(w => 
      w.weatherDescription?.toLowerCase().includes('cloud') || 
      w.weatherDescription?.toLowerCase().includes('overcast')
    );
    
    if (hasRain) return <CloudRain className="w-6 h-6 text-blue-600" />;
    if (hasClouds) return <Cloud className="w-6 h-6 text-gray-600" />;
    return <Sun className="w-6 h-6 text-yellow-500" />;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
      {/* Notification with weather theme */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl border-2 flex items-center gap-3 shadow-lg ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <CloudRain className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
      )}

      {/* Header with weather theme */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {getWeatherIcon()}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-sky-600 bg-clip-text text-transparent">
            Weather Data Management
          </h2>
        </div>
        <button
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={handleAdd}
        >
          <Plus className="w-5 h-5" />
          Add Weather Data
        </button>
      </div>

      {/* Filter Component */}
      <WeatherFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
      />

      {/* Main Content Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200 overflow-hidden">
        {/* Results Summary with weather styling */}
        {!loading && !error && (
          <div className="px-6 py-4 bg-gradient-to-r from-sky-100 to-blue-100 border-b border-sky-200">
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-sky-600" />
              <span className="font-semibold text-sky-800">
                {weatherData.length} weather record{weatherData.length !== 1 ? 's' : ''} found
                {Object.keys(filters).length > 0 && ' (filtered)'}
              </span>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-600"></div>
                <span className="text-sky-600 font-medium">Loading weather data...</span>
              </div>
            </div>
          ) : error ? (
            isServerError ? (
              <OfflineState 
                message={error}
                onRetry={retryConnection}
              />
            ) : (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <CloudRain className="w-16 h-16 text-red-400" />
                  <span className="text-red-600 font-medium">{error}</span>
                </div>
              </div>
            )
          ) : (
            <WeatherTable
              weatherData={weatherData}
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

export default WeatherView;
