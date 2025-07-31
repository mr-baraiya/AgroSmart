import React, { useEffect, useState } from "react";
import { Plus, Calendar, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { scheduleService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import ScheduleTable from "./ScheduleTable";
import ScheduleFilter from "./ScheduleFilter";
import CustomAlert from "../common/CustomAlert";

const ScheduleView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [schedules, setSchedules] = useState([]);
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
    // Only fetch schedules after initial server status check is complete
    if (!isInitialCheck) {
      console.log('🚀 Initial server check complete, fetching schedules...');
      fetchSchedules();
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

  const fetchSchedules = async (appliedFilters = null) => {
    const filtersToUse = appliedFilters !== null ? appliedFilters : filters;
    const hasFilters = Object.keys(filtersToUse).length > 0;
    
    // Debug: Log filters being sent to API
    if (hasFilters) {
      console.log('Applying schedule filters:', filtersToUse);
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
        response = await scheduleService.getFiltered(filtersToUse);
      } else {
        // Use regular API when no filters
        console.log('Calling getAll - no filters');
        response = await scheduleService.getAll();
      }
      
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Received schedule data:', data.length, 'items');
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
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

  const handleEdit = (schedule) => {
    console.log('Editing schedule:', schedule);
    console.log('Schedule ID:', schedule.scheduleId);
    navigate(`/schedules/edit/${schedule.scheduleId}`);
  };

  const handleAdd = () => {
    navigate('/schedules/add');
  };

  const handleDelete = async (schedule) => {
    showAlert(
      'confirm',
      'Delete Schedule',
      `Are you sure you want to delete the schedule "${schedule.title}"? This action cannot be undone.`,
      async () => {
        try {
          await scheduleService.delete(schedule.scheduleId);
          setSchedules((prev) => prev.filter((s) => s.scheduleId !== schedule.scheduleId));
          closeAlert();
          setNotification({
            message: `Schedule "${schedule.title}" deleted successfully!`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 5000);
        } catch (err) {
          console.error("Error deleting schedule:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            `Failed to delete schedule "${schedule.title}". Please try again.`
          );
        }
      },
      true
    );
  };

  // Navigate to the detail page
  const handleInfo = (schedule) => {
    navigate(`/schedules/${schedule.scheduleId}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchSchedules(newFilters);
  };

  // Get summary statistics
  const getScheduleStats = () => {
    const total = schedules.length;
    const completed = schedules.filter(s => s.isCompleted).length;
    const pending = schedules.filter(s => !s.isCompleted && s.status !== 'cancelled').length;
    const overdue = schedules.filter(s => 
      !s.isCompleted && 
      new Date(s.scheduledDate) < new Date() && 
      s.status !== 'cancelled'
    ).length;

    return { total, completed, pending, overdue };
  };

  const stats = getScheduleStats();

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      {/* Notification with scheduling theme */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl border-2 flex items-center gap-3 shadow-lg ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
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

      {/* Header with scheduling theme */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Schedule Management
          </h2>
        </div>
        <button
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={handleAdd}
        >
          <Plus className="w-5 h-5" />
          Add Schedule
        </button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-200 p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-2xl font-bold text-green-700">{stats.total}</h3>
              <p className="text-green-600 font-medium">Total Schedules</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-200 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-2xl font-bold text-green-700">{stats.completed}</h3>
              <p className="text-green-600 font-medium">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-200 p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-2xl font-bold text-orange-700">{stats.pending}</h3>
              <p className="text-orange-600 font-medium">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-red-200 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-2xl font-bold text-red-700">{stats.overdue}</h3>
              <p className="text-red-600 font-medium">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <ScheduleFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
      />

      {/* Main Content Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
        {/* Results Summary with scheduling styling */}
        {!loading && !error && (
          <div className="px-6 py-4 bg-gradient-to-r from-purple-100 to-orange-100 border-b border-purple-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">
                {schedules.length} schedule{schedules.length !== 1 ? 's' : ''} found
                {Object.keys(filters).length > 0 && ' (filtered)'}
              </span>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                <span className="text-purple-600 font-medium">Loading schedules...</span>
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
                  <AlertTriangle className="w-16 h-16 text-red-400" />
                  <span className="text-red-600 font-medium">{error}</span>
                </div>
              </div>
            )
          ) : (
            <ScheduleTable
              schedules={schedules}
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

export default ScheduleView;
