import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  TestTube, 
  Sun, 
  Gauge, 
  Wind, 
  CloudRain,
  Activity,
  Eye,
  Edit,
  Power,
  PowerOff,
  Calendar,
  MapPin,
  Zap,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { sensorService } from '../../../services/sensorService';
import { toast } from 'react-toastify';

const SensorCard = ({ sensor, onEdit, onViewReadings, onStatusChange, onDelete }) => {
  // Get sensor icon based on type
  const getSensorIcon = (sensorType) => {
    const iconMap = {
      'Temperature': Thermometer,
      'Humidity': Droplets,
      'Soil_Moisture': Sprout,
      'pH': TestTube,
      'Light': Sun,
      'Pressure': Gauge,
      'Wind': Wind,
      'Rain': CloudRain
    };
    return iconMap[sensorType] || Activity;
  };

  // Get status color and dot
  const getStatusInfo = () => {
    if (!sensor.isActive) {
      return { color: 'red', text: 'Inactive', dot: '🔴' };
    }
    
    const daysSinceCalibration = Math.floor(
      (new Date() - new Date(sensor.lastCalibrated)) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCalibration > sensor.calibrationInterval) {
      return { color: 'yellow', text: 'Calibration Due', dot: '🟡' };
    }
    
    return { color: 'green', text: 'Active', dot: '🟢' };
  };

  // Get quality color
  const getQualityColor = (score) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Format reading time
  const formatReadingTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  // Handle status toggle
  const handleStatusToggle = async () => {
    try {
      const updatedSensor = {
        ...sensor,
        isActive: !sensor.isActive
      };
      
      await sensorService.update(sensor.sensorId, updatedSensor);
      toast.success(`Sensor ${!sensor.isActive ? 'activated' : 'deactivated'} successfully`);
      onStatusChange();
    } catch (error) {
      toast.error('Failed to update sensor status');
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete sensor ${sensor.serialNumber}?`)) {
      try {
        await sensorService.delete(sensor.sensorId);
        toast.success('Sensor deleted successfully');
        onDelete();
      } catch (error) {
        toast.error('Failed to delete sensor');
        console.error(error);
      }
    }
  };

  const IconComponent = getSensorIcon(sensor.sensorType);
  const statusInfo = getStatusInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-green-300 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${
            sensor.sensorType === 'Temperature' ? 'bg-red-100 text-red-600' :
            sensor.sensorType === 'Humidity' ? 'bg-blue-100 text-blue-600' :
            sensor.sensorType === 'Soil_Moisture' ? 'bg-green-100 text-green-600' :
            sensor.sensorType === 'pH' ? 'bg-purple-100 text-purple-600' :
            sensor.sensorType === 'Light' ? 'bg-yellow-100 text-yellow-600' :
            sensor.sensorType === 'Pressure' ? 'bg-gray-100 text-gray-600' :
            sensor.sensorType === 'Wind' ? 'bg-cyan-100 text-cyan-600' :
            sensor.sensorType === 'Rain' ? 'bg-indigo-100 text-indigo-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {sensor.sensorType.replace('_', ' ')} Sensor
            </h3>
            <p className="text-sm text-gray-500">{sensor.manufacturer} - {sensor.model}</p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">{statusInfo.dot}</span>
          <span className={`text-sm font-medium ${
            statusInfo.color === 'green' ? 'text-green-600' :
            statusInfo.color === 'yellow' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Field info */}
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        Field ID: {sensor.fieldId}
      </div>

      {/* Latest reading */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Last Reading</p>
            <p className="text-2xl font-bold text-gray-900">
              {sensorService.formatValue(sensor.latestValue, sensor.latestUnit)} {sensor.latestUnit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Quality</p>
            <p className={`text-lg font-semibold ${getQualityColor(sensor.latestQualityScore)}`}>
              {(sensor.latestQualityScore * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {formatReadingTime(sensor.lastReadingTime)}
        </p>
      </div>

      {/* Calibration info */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Last Calibrated:</span>
        </div>
        <span>{formatReadingTime(sensor.lastCalibrated)}</span>
      </div>

      {/* Calibration warning if due */}
      {statusInfo.color === 'yellow' && (
        <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 rounded-lg p-2 mb-4">
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span>Calibration overdue by {Math.floor(
            (new Date() - new Date(sensor.lastCalibrated)) / (1000 * 60 * 60 * 24) - sensor.calibrationInterval
          )} days</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onViewReadings(sensor)}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        
        <button
          onClick={() => onEdit(sensor)}
          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleStatusToggle}
          className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm ${
            sensor.isActive 
              ? 'bg-gray-600 text-white hover:bg-gray-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {sensor.isActive ? (
            <PowerOff className="w-4 h-4" />
          ) : (
            <Power className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Serial number */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">Serial: {sensor.serialNumber}</p>
      </div>
    </motion.div>
  );
};

export default SensorCard;
