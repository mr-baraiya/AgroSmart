// src/components/dashboard/DashboardView.jsx
import React from 'react';
import StatsCard from '../common/StatsCard';
import WeatherWidget from './WeatherWidget';
import InsightsPanel from './InsightsPanel';
import SensorStatus from './SensorStatus';

export default function DashboardView() {
  return (
    <div className="p-4 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-primary-700">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Farms" value="12" icon="🌾" />
        <StatsCard title="Active Sensors" value="24" icon="📡" />
        <StatsCard title="Crops Monitored" value="18" icon="🌽" />
        <StatsCard title="Alerts" value="3" icon="🚨" />
      </div>

      {/* Mid Section: Weather + Sensor Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SensorStatus />
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>

      {/* Insights */}
      <div>
        <InsightsPanel />
      </div>
    </div>
  );
}
