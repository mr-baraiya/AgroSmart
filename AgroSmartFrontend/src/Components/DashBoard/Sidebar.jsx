import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Sprout, MapPin, Calendar, TrendingUp,
  Users, Settings, Activity, Cloud, Leaf, Layers, User
} from "lucide-react";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
  { id: "farms", label: "Farms", icon: MapPin, path: "/farms" },
  { id: "fields", label: "Fields", icon: Layers, path: "/fields" },
  { id: "crops", label: "Crops", icon: Sprout, path: "/crops" },
  { id: "sensors", label: "Sensors", icon: Activity, path: "/sensors" },
  { id: "weather", label: "Weather", icon: Cloud, path: "/weather" },
  { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
  { id: "insights", label: "Insights", icon: TrendingUp, path: "/insights" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
  { id: "users", label: "Users", icon: Users, path: "/users" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen p-4 overflow-y-auto z-40">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Leaf className="w-8 h-8" />
          AgroSmart
        </h1>
        <p className="text-green-200 text-sm">Farm Management System</p>
      </div>
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive: navIsActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                navIsActive || isActive(item.path)
                  ? "bg-white bg-opacity-20 border-l-4 border-green-300"
                  : "hover:bg-white hover:bg-opacity-10"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;