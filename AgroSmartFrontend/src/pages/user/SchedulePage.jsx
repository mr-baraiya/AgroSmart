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
  MoreVertical
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [viewType, setViewType] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: 'Plant Tomatoes',
        start: new Date(2025, 8, 10, 9, 0),
        end: new Date(2025, 8, 10, 11, 0),
        type: 'planting',
        field: 'Field A',
        description: 'Plant tomato seedlings in north section'
      },
      {
        id: 2,
        title: 'Irrigation - Corn Field',
        start: new Date(2025, 8, 8, 6, 0),
        end: new Date(2025, 8, 8, 8, 0),
        type: 'watering',
        field: 'Field B',
        description: 'Morning irrigation for corn crop'
      },
      {
        id: 3,
        title: 'Harvest Wheat',
        start: new Date(2025, 8, 15, 14, 0),
        end: new Date(2025, 8, 15, 18, 0),
        type: 'harvesting',
        field: 'Field C',
        description: 'Wheat harvest - weather permitting'
      },
      {
        id: 4,
        title: 'Fertilizer Application',
        start: new Date(2025, 8, 6, 10, 0),
        end: new Date(2025, 8, 6, 12, 0),
        type: 'maintenance',
        field: 'Field A',
        description: 'Apply organic fertilizer'
      }
    ];

    const mockTodayTasks = [
      {
        id: 1,
        title: 'Check soil moisture levels',
        completed: false,
        priority: 'high',
        estimatedTime: '30 min',
        field: 'All Fields'
      },
      {
        id: 2,
        title: 'Fertilizer application - Field A',
        completed: true,
        priority: 'medium',
        estimatedTime: '2 hours',
        field: 'Field A'
      },
      {
        id: 3,
        title: 'Inspect irrigation systems',
        completed: false,
        priority: 'medium',
        estimatedTime: '45 min',
        field: 'Field B'
      },
      {
        id: 4,
        title: 'Harvest sample collection',
        completed: false,
        priority: 'low',
        estimatedTime: '1 hour',
        field: 'Field C'
      }
    ];

    setEvents(mockEvents);
    setTodayTasks(mockTodayTasks);
  }, []);

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

  const toggleTask = (taskId) => {
    setTodayTasks(tasks => 
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    toast.success('Task updated!');
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
                popup
                showMultiDayTimes
                components={{
                  event: ({ event }) => (
                    <div className="flex items-center space-x-1 text-xs">
                      {getTaskIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  )
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
                          className="mt-1"
                        >
                          {task.completed ? (
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
    </div>
  );
};

export default SchedulePage;
