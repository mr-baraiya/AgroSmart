import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ title, value, unit, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">
          {value} {unit && <span className="text-lg font-normal text-gray-500">{unit}</span>}
        </p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">{trend}</span>
            {subtitle && (
              <span className="text-sm text-gray-500 ml-1">{subtitle}</span>
            )}
          </div>
        )}
      </div>
      <div className={`p-4 rounded-xl ${color} shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
    
    {/* Add a subtle animation bar */}
    <div className="mt-4 w-full bg-gray-100 rounded-full h-1">
      <div 
        className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${Math.min(75 + Math.random() * 25, 100)}%` }}
      ></div>
    </div>
  </div>
);

export default StatsCard;