import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Download,
  Plus,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { sensorService } from '../../../services/sensorService';
import { toast } from 'react-toastify';

const SensorCard = ({ sensor, onEdit, onStatusChange, onDelete }) => {
  const [showReadingsModal, setShowReadingsModal] = useState(false);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate sample readings for the sensor
  const generateSampleReadings = () => {
    const readings = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Every hour for 24 hours
      
      let value, unit;
      switch (sensor.sensorType) {
        case 'Temperature':
          value = (20 + Math.random() * 15).toFixed(1); // 20-35°C
          unit = '°C';
          break;
        case 'Humidity':
          value = (40 + Math.random() * 40).toFixed(1); // 40-80%
          unit = '%';
          break;
        case 'Soil_Moisture':
          value = (30 + Math.random() * 50).toFixed(1); // 30-80%
          unit = '%';
          break;
        case 'pH':
          value = (6.0 + Math.random() * 2).toFixed(1); // 6.0-8.0
          unit = 'pH';
          break;
        case 'Light':
          value = Math.floor(300 + Math.random() * 700); // 300-1000 lux
          unit = 'lux';
          break;
        case 'Pressure':
          value = (1000 + Math.random() * 50).toFixed(1); // 1000-1050 hPa
          unit = 'hPa';
          break;
        case 'Wind':
          value = (Math.random() * 20).toFixed(1); // 0-20 m/s
          unit = 'm/s';
          break;
        case 'Rain':
          value = (Math.random() * 10).toFixed(1); // 0-10 mm
          unit = 'mm';
          break;
        default:
          value = (Math.random() * 100).toFixed(1);
          unit = 'units';
      }
      
      readings.push({
        readingId: `reading_${i}`,
        sensorId: sensor.sensorId,
        timestamp: timestamp.toISOString(),
        value: parseFloat(value),
        unit,
        qualityScore: 0.85 + Math.random() * 0.15, // 85-100%
        isAnomaly: Math.random() < 0.05 // 5% chance of anomaly
      });
    }
    
    return readings.reverse(); // Show oldest first
  };

  // Handle view readings
  const handleViewReadings = () => {
    setLoading(true);
    setShowReadingsModal(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const generatedReadings = generateSampleReadings();
      setReadings(generatedReadings);
      setLoading(false);
      toast.success(`Generated ${generatedReadings.length} sample readings`);
    }, 1000);
  };

  // Handle add new reading
  const handleAddReading = () => {
    const value = prompt(`Enter new ${sensor.sensorType} reading value:`);
    if (value && !isNaN(value)) {
      const newReading = {
        readingId: `reading_${Date.now()}`,
        sensorId: sensor.sensorId,
        timestamp: new Date().toISOString(),
        value: parseFloat(value),
        unit: sensor.latestUnit,
        qualityScore: 0.9 + Math.random() * 0.1,
        isAnomaly: false
      };
      
      setReadings(prev => [newReading, ...prev]);
      toast.success('Reading added successfully');
    }
  };

  // Export readings to CSV
  const exportToCSV = () => {
    if (readings.length === 0) return;
    
    const csvContent = [
      ['Timestamp', 'Value', 'Unit', 'Quality Score', 'Anomaly'],
      ...readings.map(reading => [
        new Date(reading.timestamp).toLocaleString(),
        reading.value,
        reading.unit,
        (reading.qualityScore * 100).toFixed(1) + '%',
        reading.isAnomaly ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor_${sensor.serialNumber}_readings.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Readings exported to CSV');
  };
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
              {sensorService.formatSensorValue(sensor.latestValue, sensor.latestUnit)} {sensor.latestUnit}
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

      {/* Readings Modal */}
      <AnimatePresence>
        {showReadingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReadingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {sensor.sensorType.replace('_', ' ')} Sensor Readings
                      </h2>
                      <p className="text-blue-100">
                        Serial: {sensor.serialNumber} | Field ID: {sensor.fieldId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReadingsModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleAddReading}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Reading</span>
                  </button>
                  <button
                    onClick={exportToCSV}
                    disabled={readings.length === 0}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Generating readings...</span>
                  </div>
                ) : readings.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No readings available</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Click "View" to generate sample readings
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">Total Readings</p>
                        <p className="text-2xl font-bold text-blue-800">{readings.length}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">Average Value</p>
                        <p className="text-2xl font-bold text-green-800">
                          {(readings.reduce((sum, r) => sum + r.value, 0) / readings.length).toFixed(1)}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600 font-medium">Quality Score</p>
                        <p className="text-2xl font-bold text-yellow-800">
                          {((readings.reduce((sum, r) => sum + r.qualityScore, 0) / readings.length) * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-600 font-medium">Anomalies</p>
                        <p className="text-2xl font-bold text-red-800">
                          {readings.filter(r => r.isAnomaly).length}
                        </p>
                      </div>
                    </div>

                    {/* Readings Table */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timestamp
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quality
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {readings.map((reading, index) => (
                              <tr
                                key={reading.readingId}
                                className={`hover:bg-gray-50 ${reading.isAnomaly ? 'bg-red-50' : ''}`}
                              >
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {new Date(reading.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {reading.value} {reading.unit}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    reading.qualityScore >= 0.9 
                                      ? 'bg-green-100 text-green-800'
                                      : reading.qualityScore >= 0.7
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {(reading.qualityScore * 100).toFixed(0)}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {reading.isAnomaly ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Anomaly
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Normal
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SensorCard;
