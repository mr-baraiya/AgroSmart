import React from "react";
import {
  Home, Sprout, MapPin, Calendar, TrendingUp,
  Users, Settings, Activity, Cloud, Leaf
} from "lucide-react";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "farms", label: "Farms", icon: MapPin },
  { id: "crops", label: "Crops", icon: Sprout },
  { id: "sensors", label: "Sensors", icon: Activity },
  { id: "weather", label: "Weather", icon: Cloud },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "insights", label: "Insights", icon: TrendingUp },
  { id: "users", label: "Users", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ activeTab, setActiveTab }) => (
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
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === item.id
              ? "bg-white bg-opacity-20 border-l-4 border-green-300"
              : "hover:bg-white hover:bg-opacity-10"
          }`}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </button>
      ))}
    </nav>
  </div>
);

export default Sidebar;