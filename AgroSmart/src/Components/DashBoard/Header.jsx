import React from "react";
import { Bell, Search } from "lucide-react";

const Header = ({ activeTab, notifications, onTabClick, onSearch, onBellClick, onAvatarClick }) => {
  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left: Tab & Search */}
        <div className="flex items-center gap-4">
          {/* Clickable Active Tab */}
          <h2
            onClick={onTabClick}
            className="text-2xl font-semibold text-gray-800 capitalize cursor-pointer hover:text-green-600 transition-colors"
          >
            {activeTab}
          </h2>

          {/* Clickable Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
            />
          </div>
        </div>

        {/* Right: Bell & Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button
            onClick={onBellClick}
            className="relative p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full focus:ring-2 focus:ring-green-300"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div
            onClick={onAvatarClick}
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-green-600 transition"
            title="Open profile"
          >
            JF
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
