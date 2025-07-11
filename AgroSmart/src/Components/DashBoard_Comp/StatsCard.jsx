import React from "react";

const StatsCard = ({ title, value, unit, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {value} <span className="text-lg font-normal text-gray-500">{unit}</span>
        </p>
        {trend && (
          <p className="text-sm text-green-600 mt-1">↑ {trend}% from last week</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatsCard;