import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";

const DashboardView = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64 overflow-hidden">
        {/* Header */}
        <Header
          activeTab={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          notifications={3}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Content activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;