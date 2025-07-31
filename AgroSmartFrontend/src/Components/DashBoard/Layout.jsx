import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const location = useLocation();
  
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
