import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Trash2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { sensorService } from '../../../services/sensorService';
import { toast } from 'react-toastify';

const SensorCard = ({ sensor, onEdit, onStatusChange, onDelete }) => {
  const navigate = useNavigate();

  const handleViewReadings = () => {
    navigate(`/admin/sensors/${sensor.id}/readings`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this sensor?')) {
      try {
        await sensorService.delete(sensor.id);
        toast.success('Sensor deleted successfully');
        if (onDelete) {
          onDelete(sensor.id);
        }
      } catch (error) {
        console.error('Error deleting sensor:', error);
        toast.error('Failed to delete sensor');
      }
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = sensor.status === 'active' ? 'inactive' : 'active';
      // await sensorService.updateStatus(sensor.id, newStatus);
      toast.success(`Sensor ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      if (onStatusChange) {
        onStatusChange(sensor.id, newStatus);
      }
    } catch (error) {
      console.error('Error updating sensor status:', error);
      toast.error('Failed to update sensor status');
    }
  };

  const getSensorIcon = () => {
    switch (sensor.type?.toLowerCase()) {
      case 'temperature':
        return <Thermometer className="w-8 h-8 text-red-500" />;
      case 'humidity':
        return <Droplets className="w-8 h-8 text-blue-500" />;
      case 'soil_moisture':
        return <Sprout className="w-8 h-8 text-green-500" />;
      case 'ph':
        return <TestTube className="w-8 h-8 text-purple-500" />;
      case 'light':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'pressure':
        return <Gauge className="w-8 h-8 text-gray-500" />;
      case 'wind_speed':
        return <Wind className="w-8 h-8 text-cyan-500" />;
      case 'rainfall':
        return <CloudRain className="w-8 h-8 text-indigo-500" />;
      default:
        return <Activity className="w-8 h-8 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    switch (sensor.status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCardBorderColor = () => {
    switch (sensor.status?.toLowerCase()) {
      case 'active':
        return 'border-green-200 hover:border-green-300';
      case 'warning':
        return 'border-yellow-200 hover:border-yellow-300';
      case 'error':
        return 'border-red-200 hover:border-red-300';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm border-2 ${getCardBorderColor()} p-6 hover:shadow-md transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            {getSensorIcon()}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{sensor.name}</h3>
            <p className="text-sm text-gray-600">{sensor.type}</p>
          </div>
        </div>
        
        {/* Status badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
          {sensor.status?.charAt(0).toUpperCase() + sensor.status?.slice(1) || 'Unknown'}
        </span>
      </div>

      {/* Current reading */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Reading</p>
            <p className="text-2xl font-bold text-gray-800">
              {sensorService.formatSensorValue(sensor.lastReading || 0, sensor.type)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Last Update</p>
            <p className="text-sm text-gray-700">
              {sensor.lastUpdate ? new Date(sensor.lastUpdate).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Sensor details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{sensor.location || 'Unknown Location'}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Installed: {sensor.installDate ? new Date(sensor.installDate).toLocaleDateString() : 'Unknown'}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Zap className="w-4 h-4" />
          <span>Battery: {sensor.batteryLevel || 'Unknown'}%</span>
        </div>
      </div>

      {/* Health indicators */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Signal</div>
          <div className="text-sm font-semibold text-gray-800">{sensor.signalStrength || 'N/A'}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Accuracy</div>
          <div className="text-sm font-semibold text-gray-800">{sensor.accuracy || 'N/A'}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Range</div>
          <div className="text-sm font-semibold text-gray-800">{sensor.measurementRange || 'N/A'}</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleViewReadings}
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
          onClick={handleStatusToggle}
          className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm ${
            sensor.status === 'active' 
              ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {sensor.status === 'active' ? (
            <>
              <PowerOff className="w-4 h-4 mr-1" />
              Disable
            </>
          ) : (
            <>
              <Power className="w-4 h-4 mr-1" />
              Enable
            </>
          )}
        </button>
        
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
        >
          <Trash2 className="w-4 h-4" />
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
