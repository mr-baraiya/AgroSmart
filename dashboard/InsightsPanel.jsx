import React from 'react';
import { AlertTriangle, Lightbulb, Bell, TrendingUp } from 'lucide-react';

const InsightsPanel = ({ insights }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'Alert':
        return AlertTriangle;
      case 'Recommendation':
        return TrendingUp;
      case 'Reminder':
        return Bell;
      case 'Tip':
        return Lightbulb;
      default:
        return AlertTriangle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-600';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'Low':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Smart Insights</h3>
        <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <div key={insight.id} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className={`p-2 rounded-full ${getPriorityColor(insight.priority)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800">{insight.title}</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPriorityBadgeColor(insight.priority)}`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {insight.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    2 hours ago
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;