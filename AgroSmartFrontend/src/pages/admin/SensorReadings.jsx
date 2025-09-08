import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Thermometer, 
  Droplets, 
  Wind,
  Sun,
  Plus,
  Download,
  Filter,
  Search,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { sensorService } from '../../services/sensorService';

const SensorReadings = () => {
  const { sensorId } = useParams();
  const navigate = useNavigate();
  
  const [sensor, setSensor] = useState(null);
  const [readings, setReadings] = useState([]);
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReading, setNewReading] = useState({
    value: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  // Mock sensor data - replace with actual API call
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API calls
        const mockSensor = {
          id: sensorId,
          name: `Sensor ${sensorId}`,
          type: 'Temperature',
          location: 'Field A - Zone 1',
          status: 'active',
          lastReading: '23.5°C',
          lastUpdate: '2024-01-15 14:30'
        };
        
        const mockReadings = generateMockReadings(50);
        
        setSensor(mockSensor);
        setReadings(mockReadings);
        setFilteredReadings(mockReadings);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, [sensorId]);

  // Generate mock readings
  const generateMockReadings = (count) => {
    const readings = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now - (i * 60 * 60 * 1000)); // Every hour
      readings.push({
        id: i + 1,
        value: (Math.random() * 10 + 20).toFixed(1), // 20-30°C
        timestamp: timestamp.toISOString(),
        quality: Math.random() > 0.1 ? 'good' : 'warning'
      });
    }
    
    return readings.reverse();
  };

  // Filter readings based on search and date
  useEffect(() => {
    let filtered = readings;

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(reading => 
        new Date(reading.timestamp) >= filterDate
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reading =>
        reading.value.toString().includes(searchTerm) ||
        new Date(reading.timestamp).toLocaleDateString().includes(searchTerm)
      );
    }

    setFilteredReadings(filtered);
  }, [readings, searchTerm, dateFilter]);

  const handleAddReading = () => {
    if (!newReading.value) return;

    const reading = {
      id: readings.length + 1,
      value: parseFloat(newReading.value).toFixed(1),
      timestamp: new Date(newReading.timestamp).toISOString(),
      quality: 'good'
    };

    const updatedReadings = [reading, ...readings];
    setReadings(updatedReadings);
    setNewReading({
      value: '',
      timestamp: new Date().toISOString().slice(0, 16)
    });
    setShowAddModal(false);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Timestamp', 'Value', 'Quality'],
      ...filteredReadings.map(reading => [
        new Date(reading.timestamp).toLocaleString(),
        reading.value,
        reading.quality
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor_${sensorId}_readings.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSensorIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'humidity': return <Droplets className="w-5 h-5" />;
      case 'wind': return <Wind className="w-5 h-5" />;
      case 'light': return <Sun className="w-5 h-5" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sensor Not Found</h2>
          <p className="text-gray-600 mb-4">The requested sensor could not be found.</p>
          <button
            onClick={() => navigate('/dashboard/sensors')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Sensors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/sensors')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sensor Readings</h1>
                <p className="text-gray-600">{sensor.name} - {sensor.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Reading</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Sensor Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  {getSensorIcon(sensor.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{sensor.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Reading</p>
                  <p className="font-semibold">{sensor.lastReading}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Update</p>
                  <p className="font-semibold">{sensor.lastUpdate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${sensor.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className={`w-3 h-3 rounded-full ${sensor.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{sensor.status}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search readings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredReadings.length} of {readings.length} readings
            </div>
          </div>
        </motion.div>

        {/* Readings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Readings History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReadings.length > 0 ? (
                  filteredReadings.map((reading, index) => (
                    <motion.tr
                      key={reading.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(reading.timestamp).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(reading.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reading.value}°C
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          reading.quality === 'good' 
                            ? 'bg-green-100 text-green-800'
                            : reading.quality === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {reading.quality}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      No readings found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Add Reading Modal */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Add New Reading</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newReading.value}
                    onChange={(e) => setNewReading({...newReading, value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter sensor value"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timestamp
                  </label>
                  <input
                    type="datetime-local"
                    value={newReading.timestamp}
                    onChange={(e) => setNewReading({...newReading, timestamp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Reading
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SensorReadings;
