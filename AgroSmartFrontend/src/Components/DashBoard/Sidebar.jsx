import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Sprout, MapPin, Calendar, TrendingUp,
  Users, Settings, Activity, Cloud, Leaf, Layers, User,
  Bell, Award
} from "lucide-react";
import { useAuth } from "../../contexts/AuthProvider";
import ProfileImageDisplay from "../common/ProfileImage";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
  { id: "farms", label: "Farms", icon: MapPin, path: "/dashboard/farms" },
  { id: "fields", label: "Fields", icon: Layers, path: "/dashboard/fields" },
  { id: "crops", label: "Crops", icon: Sprout, path: "/dashboard/crops" },
  { id: "sensors", label: "Sensors", icon: Activity, path: "/dashboard/sensors" },
  { id: "weather", label: "Weather", icon: Cloud, path: "/dashboard/weather" },
  { id: "schedule", label: "Schedule", icon: Calendar, path: "/dashboard/schedules" },
  { id: "insights", label: "Insights", icon: TrendingUp, path: "/dashboard/insights" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  { id: "badges", label: "Knowledge Badges", icon: Award, path: "/dashboard/badges" },
  { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
  { id: "users", label: "Users", icon: Users, path: "/dashboard/users" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const location = useLocation();
  const { user, updateUser } = useAuth();

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className={`
      fixed left-0 top-0 w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen flex flex-col z-50
      transform transition-transform duration-300 ease-in-out
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
    `}>
      {/* Header Section */}
      <div className="p-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">AgroSmart</h1>
                <p className="text-green-200 text-sm">Farm Management System</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Section - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
        <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive: navIsActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                navIsActive || isActive(item.path)
                  ? "bg-white bg-opacity-20 border-l-4 border-green-300"
                  : "hover:bg-white hover:bg-opacity-10"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
        </nav>
      </div>
      
      {/* User Profile Section at Bottom - Fixed */}
      <div className="p-4 border-t border-white border-opacity-20">
        <div className="bg-white bg-opacity-10 rounded-lg p-3 border border-white border-opacity-20">
          <div className="flex items-center gap-3">
            <ProfileImageDisplay 
              user={user} 
              size="md" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || user?.name || 'User'}
              </p>
              <p className="text-xs text-green-200 truncate">
                {user?.role || 'Personal Farm Manager'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;