import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Wheat
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthProvider';
import ProfileImageDisplay from '../../common/ProfileImage';

const UserHeader = ({ onMenuClick }) => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:shadow-none">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Menu button and Logo (mobile) */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Mobile Logo */}
          <div className="flex items-center ml-2 lg:hidden">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-2">
              <Wheat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AgroSmart</span>
          </div>
        </div>

        {/* Center - Search Bar (desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farms, fields, crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className="flex items-center space-x-4">
          {/* Search button (mobile) */}
          <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 md:hidden">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ProfileImageDisplay 
                user={user} 
                size="sm" 
                className="mr-2"
              />
              <div className="hidden md:block text-left mr-2">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || user?.name || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">Personal Farm Manager</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    {/* <ProfileImageDisplay 
                      user={user} 
                      size="md" 
                    /> */}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.fullName || user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                      <p className="text-xs text-gray-500">Personal Farm Manager</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/user-dashboard/profile');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </button>
                
                <button
                  onClick={() => {
                    navigate('/user-dashboard/settings');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-6 pb-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search farms, fields, crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>
    </header>
  );
};

export default UserHeader;
