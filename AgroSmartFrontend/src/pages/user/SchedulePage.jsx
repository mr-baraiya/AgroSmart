import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Droplets, 
  Sprout, 
  Scissors,
  Plus,
  Filter,
  MoreVertical,
  X,
  Save,
  AlertCircle,
  MapPin,
  DollarSign,
  Timer
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import { scheduleService } from '../../services/scheduleService';
import { userFieldService } from '../../services/userFieldService';
import { authService } from '../../services/authService';

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [viewType, setViewType] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskToggleLoading, setTaskToggleLoading] = useState(null); // Track which task is being updated
  
  // Form state for adding new schedule
  const [formData, setFormData] = useState({
    fieldId: '',
    scheduleType: '',
    title: '',
    description: '',
    scheduledDate: '',
    duration: 0,
    estimatedCost: 0,
    priority: 'Medium',
    status: 'Pending'
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Load fields and schedules on component mount
  useEffect(() => {
    loadFields();
    loadSchedules();
  }, []);

  const loadFields = async () => {
    try {
      const response = await userFieldService.getAll();
      setFields(response.data || []);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error('Failed to load fields');
    }
  };

  // Load schedules from API
  const loadSchedules = async () => {
    try {
      const response = await scheduleService.getAll();
      const schedules = response.data || [];
      
      const currentUser = authService.getCurrentUser();
      const currentUserId = currentUser?.userId;
      
      // Convert API schedules to calendar events
      const calendarEvents = schedules.map(schedule => ({
        id: schedule.scheduleId,
        title: schedule.title,
        start: new Date(schedule.scheduledDate),
        end: new Date(new Date(schedule.scheduledDate).getTime() + (schedule.duration * 60 * 60 * 1000)), // Add duration in hours
        resource: {
          ...schedule,
          isEditable: schedule.createdBy === currentUserId, // Only editable if created by current user
          typeIcon: getScheduleTypeIcon(schedule.scheduleType),
          priorityColor: getCalendarPriorityColor(schedule.priority)
        }
      }));
      
      setEvents(calendarEvents);
      
      // Set today's tasks (schedules for today)
      const today = new Date();
      const todaySchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.scheduledDate);
        return scheduleDate.toDateString() === today.toDateString();
      }).map(schedule => ({
        id: schedule.scheduleId,
        title: schedule.title,
        completed: schedule.isCompleted,
        priority: schedule.priority.toLowerCase(),
        estimatedTime: `${schedule.duration}h`,
        field: `Field ${schedule.fieldId}`,
        scheduleType: schedule.scheduleType,
        isEditable: schedule.createdBy === currentUserId
      }));
      
      setTodayTasks(todaySchedules);
      
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Failed to load schedules');
    }
  };

  // Helper function to get schedule type icon
  const getScheduleTypeIcon = (type) => {
    const icons = {
      'Irrigation': '💧',
      'Fertilization': '🌿',
      'Pest Control': '🐛',
      'Soil Testing': '🧪',
      'Harvest': '🚜',
      'Planting': '🌱',
      'Weed Removal': '🌾',
      'Field Inspection': '👨‍🌾',
      'Maintenance': '🔧'
    };
    return icons[type] || '📋';
  };

  // Helper function to get priority color for calendar events
  const getCalendarPriorityColor = (priority) => {
    const colors = {
      'Low': '#10b981',      // green
      'Medium': '#f59e0b',   // yellow
      'High': '#ef4444',     // red
      'Critical': '#dc2626'  // dark red
    };
    return colors[priority] || '#6b7280';
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fieldId) errors.fieldId = 'Field is required';
    if (!formData.scheduleType) errors.scheduleType = 'Schedule type is required';
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.scheduledDate) errors.scheduledDate = 'Scheduled date is required';
    if (formData.duration <= 0) errors.duration = 'Duration must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      const scheduleData = {
        scheduleId: 0,
        fieldId: parseInt(formData.fieldId),
        scheduleType: formData.scheduleType,
        title: formData.title,
        description: formData.description,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        duration: parseInt(formData.duration),
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        priority: formData.priority,
        status: formData.status,
        isCompleted: false,
        createdBy: currentUser?.userId || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await scheduleService.create(scheduleData);
      
      toast.success('Schedule created successfully!');
      handleCloseModal();
      
      // Refresh the calendar data
      loadSchedules();
      
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Custom event component for calendar
  const CustomEvent = ({ event }) => {
    const isEditable = event.resource?.isEditable;
    const typeIcon = event.resource?.typeIcon;
    const priorityColor = event.resource?.priorityColor;
    const isCompleted = event.resource?.isCompleted;
    
    return (
      <div 
        className={`px-2 py-1 rounded text-xs font-medium ${
          isCompleted 
            ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
            : isEditable 
              ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' 
              : 'bg-gray-100 text-gray-600 border-l-4 border-gray-400'
        }`}
        style={{ 
          borderLeftColor: isCompleted ? '#10b981' : priorityColor,
          backgroundColor: isCompleted ? '#dcfce7' : isEditable ? '#dbeafe' : '#f9fafb',
          opacity: isCompleted ? 0.8 : 1
        }}
        title={`${event.title} ${isCompleted ? '(Completed)' : isEditable ? '(Editable)' : '(Read-only)'}`}
      >
        <div className="flex items-center gap-1">
          {isCompleted && <span>✅</span>}
          <span>{typeIcon}</span>
          <span className={`truncate ${isCompleted ? 'line-through' : ''}`}>
            {event.title}
          </span>
          {!isEditable && !isCompleted && <span className="text-gray-400">🔒</span>}
        </div>
      </div>
    );
  };

  // Handle event click
  const handleEventClick = (event) => {
    const schedule = event.resource;
    if (schedule.isEditable) {
      // User can edit this schedule
      toast.info(`You can edit: ${event.title}`);
      // Here you can add edit functionality
    } else {
      // Read-only schedule
      toast.info(`Read-only schedule: ${event.title} (Created by another user)`);
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    // Prevent multiple requests for the same task
    if (taskToggleLoading === taskId) return;
    
    try {
      setTaskToggleLoading(taskId);
      
      // Find the task
      const task = todayTasks.find(t => t.id === taskId);
      if (!task) {
        toast.error('Task not found');
        return;
      }
      
      if (!task.isEditable) {
        toast.warning('You can only modify schedules you created');
        return;
      }
      
      const newCompletionStatus = !task.completed;
      
      const response = await scheduleService.markAsCompleted(taskId, newCompletionStatus);
      
      if (response && response.data) {
        // Update local state only after successful API call
        setTodayTasks(prev => prev.map(currentTask => 
          currentTask.id === taskId 
            ? { ...currentTask, completed: newCompletionStatus }
            : currentTask
        ));
        
        // Also update the events array to reflect the change
        setEvents(prev => prev.map(event => 
          event.id === taskId 
            ? { 
                ...event, 
                resource: { 
                  ...event.resource, 
                  isCompleted: newCompletionStatus 
                } 
              }
            : event
        ));
        
        toast.success(
          newCompletionStatus 
            ? '🎉 Task completed successfully!' 
            : '📝 Task marked as incomplete'
        );
      }
      
    } catch (error) {
      console.error('❌ Error toggling task completion:', error);
      
      // Show specific error message if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.Message || 
                          'Failed to update task completion status';
      
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setTaskToggleLoading(null);
    }
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      fieldId: '',
      scheduleType: '',
      title: '',
      description: '',
      scheduledDate: '',
      duration: 0,
      estimatedCost: 0,
      priority: 'Medium',
      status: 'Pending'
    });
    setFormErrors({});
  };

  // Helper functions for calendar events

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    
    switch (event.type) {
      case 'planting':
        backgroundColor = '#10b981'; // green
        break;
      case 'watering':
        backgroundColor = '#3b82f6'; // blue
        break;
      case 'harvesting':
        backgroundColor = '#f59e0b'; // orange
        break;
      case 'maintenance':
        backgroundColor = '#8b5cf6'; // purple
        break;
      default:
        backgroundColor = '#6b7280'; // gray
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const completedTasksCount = todayTasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasksCount / todayTasks.length) * 100;

  const getTaskIcon = (type) => {
    switch (type) {
      case 'planting': return <Sprout className="w-4 h-4" />;
      case 'watering': return <Droplets className="w-4 h-4" />;
      case 'harvesting': return <Scissors className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-blue-600 rounded-xl text-white">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
              <p className="text-gray-600">Plan and track your farming activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="month">Month View</option>
              <option value="week">Week View</option>
              <option value="day">Day View</option>
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="xl:col-span-3 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                view={viewType}
                onView={setViewType}
                date={selectedDate}
                onNavigate={setSelectedDate}
                onSelectEvent={handleEventClick}
                popup
                showMultiDayTimes
                components={{
                  event: CustomEvent
                }}
              />
            </div>
          </motion.div>

          {/* Today's Tasks Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
                <span className="text-sm text-gray-500">
                  {completedTasksCount}/{todayTasks.length}
                </span>
              </div>
              
              {/* Progress Ring */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
                <Filter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              
              <AnimatePresence>
                <div className="space-y-3">
                  {todayTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        task.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 ${!task.isEditable ? 'cursor-not-allowed opacity-50' : ''} ${taskToggleLoading === task.id ? 'animate-pulse' : ''}`}
                          disabled={!task.isEditable || taskToggleLoading === task.id}
                          title={task.isEditable ? 'Toggle completion' : 'Read-only (created by another user)'}
                        >
                          {taskToggleLoading === task.id ? (
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              task.completed ? 'text-green-800 line-through' : 'text-gray-900'
                            }`}>
                              {task.title}
                              {!task.isEditable && (
                                <span className="ml-2 text-xs text-gray-400">🔒 Read-only</span>
                              )}
                            </h4>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">{task.estimatedTime}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">{task.field}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Plus className="w-6 h-6 text-green-600" />
                    Add New Schedule
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Field Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Field *
                    </label>
                    <select
                      name="fieldId"
                      value={formData.fieldId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        formErrors.fieldId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a field</option>
                      {fields.map(field => (
                        <option key={field.fieldId} value={field.fieldId}>
                          {field.fieldName} - {field.location}
                        </option>
                      ))}
                    </select>
                    {formErrors.fieldId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.fieldId}
                      </p>
                    )}
                  </div>

                  {/* Schedule Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Type *
                    </label>
                    <select
                      name="scheduleType"
                      value={formData.scheduleType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        formErrors.scheduleType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select schedule type</option>
                      <option value="Planting">🌱 Planting</option>
                      <option value="Irrigation">💧 Irrigation</option>
                      <option value="Fertilization">🌿 Fertilization</option>
                      <option value="Harvesting">🚜 Harvesting</option>
                      <option value="Maintenance">🔧 Maintenance</option>
                      <option value="Pest Control">🐛 Pest Control</option>
                      <option value="Soil Testing">🧪 Soil Testing</option>
                      <option value="Other">📋 Other</option>
                    </select>
                    {formErrors.scheduleType && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.scheduleType}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter schedule title"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter schedule description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date and Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Scheduled Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-2" />
                        Scheduled Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formErrors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.scheduledDate && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.scheduledDate}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Timer className="w-4 h-4 inline mr-2" />
                        Duration (hours) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="0.5"
                        step="0.5"
                        placeholder="0"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formErrors.duration ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.duration && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Priority and Cost Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Low">🟢 Low</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="High">🔴 High</option>
                        <option value="Critical">🚨 Critical</option>
                      </select>
                    </div>

                    {/* Estimated Cost */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Estimated Cost
                      </label>
                      <input
                        type="number"
                        name="estimatedCost"
                        value={formData.estimatedCost}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={loading}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Create Schedule
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchedulePage;
