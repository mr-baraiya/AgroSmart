import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render layout if not authenticated (ProtectedRoute will handle redirect)
  if (!isAuthenticated) {
    return null;
  }
  
  // Get the current page name from the path
  const getPageTitle = (pathname) => {
    const path = pathname.replace('/', '');
    if (!path || path === 'dashboard') return 'Dashboard';
    
    // Handle specific routes
    if (path.startsWith('crops/edit/') || path.startsWith('crops/add')) {
      return 'Crops';
    }
    if (path.startsWith('farms/edit/') || path.startsWith('farms/add')) {
      return 'Farms';
    }
    if (path.startsWith('fields/edit/') || path.startsWith('fields/add')) {
      return 'Fields';
    }
    if (path.startsWith('weather/edit/') || path.startsWith('weather/add')) {
      return 'Weather';
    }
    if (path.startsWith('schedule/edit/') || path.startsWith('schedule/add')) {
      return 'Schedule';
    }
    if (path === 'profile') {
      return 'Profile';
    }
    
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64 overflow-hidden">
        {/* Header */}
        <Header
          activeTab={getPageTitle(location.pathname)}
          notifications={3}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
