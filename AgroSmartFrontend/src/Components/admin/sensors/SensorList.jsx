import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { sensorService } from '../../../services/sensorService';
import { adminFieldService } from '../../../services/adminFieldService';
import SensorCard from './SensorCard';
import SensorFormModal from './SensorFormModal';
import SensorReadings from './SensorReadings';
import { toast } from 'react-toastify';

const SensorList = () => {
  const [sensors, setSensors] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showReadingsModal, setShowReadingsModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    calibrationDue: 0
  });

  const sensorTypes = [
    'Temperature',
    'Humidity', 
    'Soil_Moisture',
    'pH',
    'Light',
    'Pressure',
    'Wind',
    'Rain'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateStats();
  }, [sensors]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sensorsData, fieldsResponse] = await Promise.all([
        sensorService.getAll(),
        adminFieldService.getAllFields()
      ]);
      
      setSensors(sensorsData);
      setFields(fieldsResponse.data || fieldsResponse);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load sensor data');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const total = sensors.length;
    const active = sensors.filter(s => s.isActive).length;
    const inactive = total - active;
    const calibrationDue = sensors.filter(s => {
      const daysSinceCalibration = Math.floor(
        (new Date() - new Date(s.lastCalibrated)) / (1000 * 60 * 60 * 24)
      );
      return s.isActive && daysSinceCalibration > s.calibrationInterval;
    }).length;

    setStats({ total, active, inactive, calibrationDue });
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.sensorType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || sensor.sensorType === selectedType;
    const matchesField = !selectedField || sensor.fieldId.toString() === selectedField;
    
    let matchesStatus = true;
    if (selectedStatus === 'active') {
      matchesStatus = sensor.isActive;
    } else if (selectedStatus === 'inactive') {
      matchesStatus = !sensor.isActive;
    } else if (selectedStatus === 'calibration-due') {
      const daysSinceCalibration = Math.floor(
        (new Date() - new Date(sensor.lastCalibrated)) / (1000 * 60 * 60 * 24)
      );
      matchesStatus = sensor.isActive && daysSinceCalibration > sensor.calibrationInterval;
    }

    return matchesSearch && matchesType && matchesField && matchesStatus;
  });

  const handleAddSensor = () => {
    setSelectedSensor(null);
    setShowModal(true);
  };

  const handleEditSensor = (sensor) => {
    setSelectedSensor(sensor);
    setShowModal(true);
  };

  const handleViewReadings = (sensor) => {
    setSelectedSensor(sensor);
    setShowReadingsModal(true);
  };

  const handleDeleteSensor = async () => {
    loadData();
  };

  const handleModalSave = () => {
    setShowModal(false);
    loadData();
  };

  const handleStatusChange = () => {
    loadData();
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Type', 'Manufacturer', 'Model', 'Serial Number', 'Field ID', 'Status', 'Latest Value', 'Unit', 'Quality Score', 'Last Reading'],
      ...filteredSensors.map(sensor => [
        sensor.sensorId,
        sensor.sensorType,
        sensor.manufacturer,
        sensor.model,
        sensor.serialNumber,
        sensor.fieldId,
        sensor.isActive ? 'Active' : 'Inactive',
        sensor.latestValue,
        sensor.latestUnit,
        (sensor.latestQualityScore * 100).toFixed(0) + '%',
        new Date(sensor.lastReadingTime).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading sensors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IoT Sensors</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your field sensors</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={handleAddSensor}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sensor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Sensors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Calibration Due</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.calibrationDue}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sensors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {sensorTypes.map(type => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>

          {/* Field Filter */}
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Fields</option>
            {fields.map(field => (
              <option key={field.fieldId} value={field.fieldId}>
                {field.fieldName} - {field.farmName}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="calibration-due">Calibration Due</option>
          </select>
        </div>
      </div>

      {/* Sensors Grid */}
      {filteredSensors.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sensors found</h3>
          <p className="text-gray-600 mb-4">
            {sensors.length === 0 
              ? "Get started by adding your first sensor"
              : "Try adjusting your search criteria"
            }
          </p>
          {sensors.length === 0 && (
            <button
              onClick={handleAddSensor}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Sensor
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensors.map((sensor, index) => (
            <motion.div
              key={sensor.sensorId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SensorCard
                sensor={sensor}
                onEdit={handleEditSensor}
                onViewReadings={handleViewReadings}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteSensor}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Sensor Form Modal */}
      <SensorFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        sensor={selectedSensor}
        onSave={handleModalSave}
      />

      {/* Sensor Readings Modal */}
      <SensorReadings
        isOpen={showReadingsModal}
        onClose={() => setShowReadingsModal(false)}
        sensor={selectedSensor}
      />
    </div>
  );
};

export default SensorList;
