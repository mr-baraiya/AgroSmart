import React, { useEffect, useState } from "react";
import { Plus, Users, UserCheck, UserX, Shield, Edit, Trash2, Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminUserService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import UserTable from "./UserTable";
import UserFilter from "./UserFilter";
import CustomAlert from "../common/CustomAlert";
import { toast } from 'react-toastify';

const UsersView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [users, setUsers] = useState([]);
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
    onCancel: null
  });

  // Show alert function
  const showAlert = (type, title, message, onConfirm = null, onCancel = null) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      onCancel
    });
  };

  // Close alert function
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    if (isServerOnline && !isInitialCheck) {
      fetchUsers();
    }
  }, [isServerOnline, isInitialCheck]);

  // Handle location state messages
  useEffect(() => {
    if (location.state?.message) {
      const { message, type } = location.state;
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchUsers = async (filterParams = {}) => {
    if (!isServerOnline) {
      setIsServerError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setIsServerError(false);

    try {
      let response;
      if (Object.keys(filterParams).length > 0) {
        response = await adminUserService.filterUsers(filterParams);
      } else {
        response = await adminUserService.getAllUsers();
      }
      
      if (response && response.data) {
        setUsers(response.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      const errorHandled = handleApiError(err);
      
      if (!errorHandled) {
        setError("Failed to load users. Please try again.");
        setUsers([]);
      } else {
        setIsServerError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    console.log('Editing user:', user);
    console.log('User ID:', user.userId);
    navigate(`/dashboard/users/edit/${user.userId}`);
  };

  const handleAdd = () => {
    navigate('/dashboard/users/add');
  };

  const handleSoftDelete = async (user) => {
    showAlert(
      'confirm',
      'Deactivate User',
      `Are you sure you want to deactivate "${user.fullName}"? This will set the user as inactive but preserve their data.`,
      async () => {
        try {
          await adminUserService.softDeleteUser(user.userId);
          closeAlert();
          toast.success(`User "${user.fullName}" has been deactivated successfully!`);
          fetchUsers(filters); // Refresh the list
        } catch (error) {
          console.error('Error deactivating user:', error);
          toast.error(`Failed to deactivate user "${user.fullName}". Please try again.`);
        }
      }
    );
  };

  const handleHardDelete = async (user) => {
    showAlert(
      'confirm',
      'Permanently Delete User',
      `Are you sure you want to permanently delete "${user.fullName}"? This action cannot be undone and will remove all user data permanently.`,
      async () => {
        try {
          await adminUserService.hardDeleteUser(user.userId);
          closeAlert();
          toast.success(`User "${user.fullName}" has been permanently deleted!`);
          fetchUsers(filters); // Refresh the list
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error(`Failed to delete user "${user.fullName}". Please try again.`);
        }
      }
    );
  };

  // Navigate to the detail page
  const handleInfo = (user) => {
    navigate(`/dashboard/users/${user.userId}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // Server is offline
  if (!isServerOnline && !isInitialCheck) {
    return (
      <OfflineState 
        onRetry={retryConnection}
        message="Unable to load users. Please check your connection and try again."
      />
    );
  }

  // Server error state
  if (isServerError) {
    return (
      <OfflineState 
        onRetry={() => {
          setIsServerError(false);
          fetchUsers();
        }}
        message="Unable to connect to the server. Please try again."
      />
    );
  }

  // Get stats for the header cards
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const inactiveUsers = users.filter(user => !user.isActive).length;
  const adminUsers = users.filter(user => user.role === 'Admin').length;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage system users, roles, and permissions</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-3xl font-bold text-red-600">{inactiveUsers}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-3xl font-bold text-purple-600">{adminUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <UserFilter 
        onFilterChange={handleFilterChange}
        loading={filterLoading}
      />

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <UserTable
          users={users}
          loading={loading}
          onEdit={handleEdit}
          onSoftDelete={handleSoftDelete}
          onHardDelete={handleHardDelete}
          onInfo={handleInfo}
          error={error}
        />
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        onClose={closeAlert}
      />

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default UsersView;
