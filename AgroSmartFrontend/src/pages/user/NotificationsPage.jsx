import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Trash2,
  Filter,
  MoreVertical,
  BellRing
} from 'lucide-react';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockNotifications = [
      {
        id: 1,
        type: 'alert',
        title: 'Soil Moisture Critical',
        message: 'Field A soil moisture has dropped below 30%. Immediate irrigation recommended.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        priority: 'high',
        actionUrl: '/schedule'
      },
      {
        id: 2,
        type: 'info',
        title: 'Weather Update',
        message: 'Heavy rainfall expected tomorrow. Consider adjusting irrigation schedule.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        priority: 'medium',
        actionUrl: '/weather'
      },
      {
        id: 3,
        type: 'success',
        title: 'Harvest Completed',
        message: 'Wheat harvest in Field C has been successfully completed. Yield: 2.5 tons.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: true,
        priority: 'low',
        actionUrl: '/insights'
      },
      {
        id: 4,
        type: 'warning',
        title: 'Pest Activity Detected',
        message: 'Increased pest activity in Field B. Schedule inspection and treatment.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false,
        priority: 'high',
        actionUrl: '/schedule'
      },
      {
        id: 5,
        type: 'info',
        title: 'Equipment Maintenance Due',
        message: 'Tractor #2 is due for routine maintenance. Schedule service appointment.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        priority: 'medium',
        actionUrl: '/equipment'
      },
      {
        id: 6,
        type: 'success',
        title: 'Irrigation Cycle Complete',
        message: 'Automated irrigation cycle for Field A completed successfully.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        isRead: true,
        priority: 'low',
        actionUrl: '/schedule'
      },
      {
        id: 7,
        type: 'alert',
        title: 'System Alert',
        message: 'Sensor in Field B is not responding. Check connection and battery.',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
        isRead: false,
        priority: 'high',
        actionUrl: '/sensors'
      },
      {
        id: 8,
        type: 'info',
        title: 'Weekly Report Ready',
        message: 'Your weekly farm performance report is ready for review.',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        isRead: true,
        priority: 'low',
        actionUrl: '/reports'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const groupNotificationsByTime = (notifications) => {
    const today = [];
    const thisWeek = [];
    const older = [];

    notifications.forEach(notification => {
      const now = new Date();
      const notificationDate = notification.timestamp;
      const diffDays = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        today.push(notification);
      } else if (diffDays <= 7) {
        thisWeek.push(notification);
      } else {
        older.push(notification);
      }
    });

    return { today, thisWeek, older };
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const groupedNotifications = groupNotificationsByTime(filteredNotifications);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
    toast.success('Notification deleted');
  };

  const deleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    setNotifications(prev =>
      prev.filter(notification => !selectedNotifications.includes(notification.id))
    );
    setSelectedNotifications([]);
    toast.success(`${selectedNotifications.length} notifications deleted`);
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationGroup = ({ title, notifications, icon }) => {
    if (notifications.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {notifications.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl shadow-sm border-l-4 p-4 hover:shadow-md transition-all duration-200 ${
                notification.isRead ? 'opacity-75' : ''
              } ${
                notification.priority === 'high' ? 'border-l-red-500' :
                notification.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelectNotification(notification.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        notification.isRead ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{getTimeAgo(notification.timestamp)}</span>
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="relative p-3 bg-blue-600 rounded-xl text-white">
              <BellRing className="w-8 h-8" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedNotifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-900 font-medium">
                  {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={deleteSelected}
                    className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => setSelectedNotifications([])}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <AnimatePresence>
          <NotificationGroup
            title="Today"
            notifications={groupedNotifications.today}
            icon={<Clock className="w-5 h-5 text-blue-500" />}
          />
          
          <NotificationGroup
            title="This Week"
            notifications={groupedNotifications.thisWeek}
            icon={<Clock className="w-5 h-5 text-green-500" />}
          />
          
          <NotificationGroup
            title="Older"
            notifications={groupedNotifications.older}
            icon={<Clock className="w-5 h-5 text-gray-500" />}
          />
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? "You don't have any unread notifications." 
                : "You're all caught up!"
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
