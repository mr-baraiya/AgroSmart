import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  BarChart3,
  Wheat,
  Calendar,
  Settings,
  User,
  Bell,
  TrendingUp,
  Cloud,
  BookOpen,
  Award
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthProvider';
import ProfileImageDisplay from '../../common/ProfileImage';

const UserSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, updateUser } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/user-dashboard',
      icon: Home,
      exact: true
    },
    {
      name: 'My Farms',
      href: '/user-dashboard/my-farms',
      icon: MapPin
    },
    {
      name: 'My Fields',
      href: '/user-dashboard/my-fields',
      icon: BarChart3
    },
    {
      name: 'My Crops',
      href: '/user-dashboard/my-crops',
      icon: Wheat
    },
    {
      name: 'Schedule',
      href: '/user-dashboard/schedule',
      icon: Calendar
    },
    {
      name: 'Weather',
      href: '/user-dashboard/weather',
      icon: Cloud
    },
    {
      name: 'Insights',
      href: '/user-dashboard/insights',
      icon: TrendingUp
    },
    {
      name: 'Notifications',
      href: '/user-dashboard/notifications',
      icon: Bell
    },
    {
      name: 'Knowledge Base',
      href: '/user-dashboard/knowledge',
      icon: Award
    }
  ];

  const settingsItems = [
    {
      name: 'Profile',
      href: '/user-dashboard/profile',
      icon: User
    },
    {
      name: 'Settings',
      href: '/user-dashboard/settings',
      icon: Settings
    }
  ];

  const isActiveLink = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-center h-16 px-4 bg-green-600">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <Wheat className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-white">
                <h1 className="text-lg font-bold">AgroSmart</h1>
                <p className="text-xs text-green-100">Personal Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.href, item.exact);
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                      ${isActive
                        ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`
                      w-5 h-5 mr-3 flex-shrink-0
                      ${isActive ? 'text-green-600' : 'text-gray-400'}
                    `} />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200" />

            {/* Settings Section */}
            <div className="space-y-1">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Account
              </h3>
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.href);
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                      ${isActive
                        ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`
                      w-5 h-5 mr-3 flex-shrink-0
                      ${isActive ? 'text-green-600' : 'text-gray-400'}
                    `} />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <ProfileImageDisplay 
                user={user} 
                size="md" 
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">Personal Farm Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
