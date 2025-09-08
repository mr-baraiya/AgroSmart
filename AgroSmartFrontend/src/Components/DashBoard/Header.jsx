import React, { useState } from "react";
import { Bell, Search, User, LogOut, Settings, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import ProfileImageDisplay from "../common/ProfileImage";

const Header = ({ activeTab, notifications, onTabClick, onSearch, onBellClick, onMenuClick }) => {
  const { user, logout, isAuthenticated, updateUser, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
    setShowUserMenu(false);
  };

  if (!isAuthenticated) {
    return null; // Don't render header if not authenticated
  }
  
  return (
    <div className="bg-white shadow-sm border-b px-4 lg:px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left: Mobile Menu Button & Tab & Search */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Clickable Active Tab */}
          <h2
            onClick={onTabClick}
            className="text-xl lg:text-2xl font-semibold text-gray-800 capitalize cursor-pointer hover:text-green-600 transition-colors"
          >
            {activeTab}
          </h2>

          {/* Search Input - Hidden on mobile, shown on desktop */}
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow w-64"
            />
          </div>
        </div>

        {/* Right: Search (Mobile), Bell & Avatar */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg">
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={onBellClick}
            className="relative p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg focus:ring-2 focus:ring-green-300"
          >
            <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-[10px] lg:text-xs">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg focus:ring-2 focus:ring-green-300"
            >
              <ProfileImageDisplay 
                user={user} 
                size="sm" 
              />
              <span className="hidden lg:block text-sm font-medium">
                {user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <ProfileImageDisplay 
                      user={user} 
                      size="md" 
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || user?.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                
                <button
                  onClick={() => {
                    navigate('/dashboard/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                
                <hr className="my-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Header;
