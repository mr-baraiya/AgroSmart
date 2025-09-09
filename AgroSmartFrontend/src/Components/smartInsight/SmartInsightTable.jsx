import React from 'react';
import { motion } from 'framer-motion';
import {
  Edit,
  Trash2,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Tag,
  Lightbulb
} from 'lucide-react';

const SmartInsightTable = ({
  insights,
  onEdit,
  onDelete,
  onInfo,
  onToggleResolve,
  selectedInsights,
  onSelectInsight,
  viewMode = 'table'
}) => {
  if (insights.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
        <p className="text-gray-500">No smart insights match your current filters.</p>
      </div>
    );
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  if (viewMode === 'cards') {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.insightId || insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(insight.type)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                  {insight.priority}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onInfo(insight)}
                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 border border-blue-200"
                  title="View Details"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(insight)}
                  className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-all duration-200 border border-amber-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(insight)}
                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {insight.title}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-3">
                {insight.message}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {insight.type}
                </span>
                {insight.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  insight.isResolved 
                    ? 'text-green-700 bg-green-50' 
                    : 'text-orange-700 bg-orange-50'
                }`}>
                  {insight.isResolved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {insight.isResolved ? 'Resolved' : 'Active'}
                </span>
                
                <button
                  onClick={() => onToggleResolve(insight)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    insight.isResolved
                      ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                      : 'text-green-700 bg-green-50 hover:bg-green-100'
                  }`}
                >
                  {insight.isResolved ? 'Mark Active' : 'Mark Resolved'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Table view
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-6 py-3 text-left">
              {/* Select header - handled by parent */}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {insights.map((insight, index) => (
            <motion.tr
              key={insight.insightId || insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Checkbox */}
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedInsights.includes(insight.insightId || insight.id)}
                  onChange={(e) => onSelectInsight(insight.insightId || insight.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>

              {/* Title */}
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {insight.title}
                </div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {insight.message}
                </div>
              </td>

              {/* Type */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(insight.type)}
                  <span className="text-sm text-gray-900">{insight.type}</span>
                </div>
              </td>

              {/* Priority */}
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(insight.priority)}`}>
                  {insight.priority}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    insight.isResolved 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-orange-700 bg-orange-50'
                  }`}>
                    {insight.isResolved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {insight.isResolved ? 'Resolved' : 'Active'}
                  </span>
                  <button
                    onClick={() => onToggleResolve(insight)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      insight.isResolved
                        ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                        : 'text-green-700 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {insight.isResolved ? 'Activate' : 'Resolve'}
                  </button>
                </div>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 text-sm text-gray-500">
                {insight.createdAt ? new Date(insight.createdAt).toLocaleDateString() : '-'}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onInfo(insight)}
                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                    title="View Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(insight)}
                    className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-all duration-200 border border-amber-200 hover:border-amber-300"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(insight)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SmartInsightTable;
