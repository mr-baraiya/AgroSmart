import React from "react";
import { Eye, Edit, Trash2, Clock, CheckCircle2, AlertTriangle, Target, Calendar } from "lucide-react";

const ScheduleTableRow = ({ schedule, onEdit, onDelete, onInfo, index }) => {
  // Get priority color and icon
  const getPriorityDisplay = (priority) => {
    const p = priority?.toLowerCase() || 'medium';
    switch (p) {
      case 'high':
      case 'urgent':
        return { 
          color: 'text-red-600 bg-red-100', 
          icon: <AlertTriangle className="w-4 h-4" />,
          text: 'High'
        };
      case 'medium':
      case 'normal':
        return { 
          color: 'text-orange-600 bg-orange-100', 
          icon: <Target className="w-4 h-4" />,
          text: 'Medium'
        };
      case 'low':
        return { 
          color: 'text-green-600 bg-green-100', 
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'Low'
        };
      default:
        return { 
          color: 'text-gray-600 bg-gray-100', 
          icon: <Target className="w-4 h-4" />,
          text: priority || 'Medium'
        };
    }
  };

  // Get status color and display
  const getStatusDisplay = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'completed':
        return { color: 'text-green-700 bg-green-100', text: 'Completed' };
      case 'in_progress':
      case 'in progress':
        return { color: 'text-blue-700 bg-blue-100', text: 'In Progress' };
      case 'pending':
        return { color: 'text-orange-700 bg-orange-100', text: 'Pending' };
      case 'cancelled':
        return { color: 'text-red-700 bg-red-100', text: 'Cancelled' };
      case 'delayed':
        return { color: 'text-purple-700 bg-purple-100', text: 'Delayed' };
      default:
        return { color: 'text-gray-700 bg-gray-100', text: status || 'Pending' };
    }
  };

  // Check if schedule is overdue
  const isOverdue = () => {
    return !schedule.isCompleted && 
           new Date(schedule.scheduledDate) < new Date() && 
           schedule.status !== 'cancelled';
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch {
      return { date: 'Invalid Date', time: '' };
    }
  };

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return 'Not specified';
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const priorityDisplay = getPriorityDisplay(schedule.priority);
  const statusDisplay = getStatusDisplay(schedule.status);
  const scheduledDate = formatDate(schedule.scheduledDate);
  const overdue = isOverdue();

  // Row background with alternating green theme
  const rowBg = index % 2 === 0 ? 'bg-green-25' : 'bg-white';

  return (
    <tr className={`${rowBg} hover:bg-green-50 transition-colors duration-200 border-b border-green-100 ${
      overdue ? 'bg-red-25 hover:bg-red-50' : ''
    }`}>
      {/* Title & Type */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-green-900">{schedule.title || 'Untitled'}</span>
          <span className="text-sm text-green-600 capitalize">
            {schedule.scheduleType || 'General Task'}
          </span>
          {schedule.description && (
            <span className="text-xs text-gray-600 mt-1 line-clamp-2">
              {schedule.description}
            </span>
          )}
        </div>
      </td>

      {/* Scheduled Date */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className={`font-medium ${overdue ? 'text-red-700' : 'text-gray-800'}`}>
              {scheduledDate.date}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-600">{scheduledDate.time}</span>
          </div>
          {overdue && (
            <span className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Overdue
            </span>
          )}
        </div>
      </td>

      {/* Duration */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-gray-700 font-medium">
            {formatDuration(schedule.duration)}
          </span>
        </div>
        {schedule.estimatedCost > 0 && (
          <div className="text-sm text-gray-600 mt-1">
            Cost: ${schedule.estimatedCost.toFixed(2)}
          </div>
        )}
      </td>

      {/* Priority */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${priorityDisplay.color}`}>
          {priorityDisplay.icon}
          {priorityDisplay.text}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
          {statusDisplay.text}
        </span>
      </td>

      {/* Completion */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {schedule.isCompleted ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Completed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              <span>Pending</span>
            </div>
          )}
        </div>
        {schedule.createdAt && (
          <div className="text-xs text-gray-500 mt-1">
            Created: {new Date(schedule.createdAt).toLocaleDateString()}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onInfo(schedule)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200 group"
            title="View Details"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={() => onEdit(schedule)}
            className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-all duration-200 group"
            title="Edit Schedule"
          >
            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={() => onDelete(schedule)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 group"
            title="Delete Schedule"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ScheduleTableRow;
