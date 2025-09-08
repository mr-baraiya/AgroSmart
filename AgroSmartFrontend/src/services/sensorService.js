import api from './api';

const BASE_URL = '/Sensor';
const READING_URL = '/SensorReading';

// Sensor API endpoints
export const sensorService = {
  // Sensor CRUD operations
  getAll: async () => {
    try {
      const response = await api.get(`${BASE_URL}/All`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor:', error);
      throw error;
    }
  },
  
  create: async (sensorData) => {
    try {
      const response = await api.post(BASE_URL, sensorData);
      return response.data;
    } catch (error) {
      console.error('Error creating sensor:', error);
      throw error;
    }
  },
  
  update: async (id, sensorData) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, sensorData);
      return response.data;
    } catch (error) {
      console.error('Error updating sensor:', error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sensor:', error);
      throw error;
    }
  },
  
  // Additional sensor endpoints
  getDropdown: async () => {
    try {
      const response = await api.get(`${BASE_URL}/Dropdown`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor dropdown:', error);
      throw error;
    }
  },
  
  getFiltered: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`${BASE_URL}/Filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering sensors:', error);
      throw error;
    }
  },

  // Sensor Reading endpoints
  getAllReadings: async () => {
    try {
      const response = await api.get(`${READING_URL}/All`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all readings:', error);
      throw error;
    }
  },

  getReadingById: async (id) => {
    try {
      const response = await api.get(`${READING_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reading:', error);
      throw error;
    }
  },

  getFilteredReadings: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`${READING_URL}/Filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering readings:', error);
      throw error;
    }
  },

  // Get readings for a sensor (alias for getFilteredReadings)
  getReadings: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`${READING_URL}/Filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting readings:', error);
      throw error;
    }
  },

  createReading: async (readingData) => {
    try {
      const response = await api.post(READING_URL, readingData);
      return response.data;
    } catch (error) {
      console.error('Error creating reading:', error);
      throw error;
    }
  },

  updateReading: async (id, readingData) => {
    try {
      const response = await api.put(`${READING_URL}/${id}`, readingData);
      return response.data;
    } catch (error) {
      console.error('Error updating reading:', error);
      throw error;
    }
  },

  deleteReading: async (id) => {
    try {
      const response = await api.delete(`${READING_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reading:', error);
      throw error;
    }
  },

  // Utility functions
  getStatusText: (sensor) => {
    if (!sensor.isActive) return 'Inactive';
    
    const daysSinceReading = sensor.lastReading 
      ? Math.floor((new Date() - new Date(sensor.lastReading)) / (1000 * 60 * 60 * 24))
      : 999;
    
    if (daysSinceReading > 7) return 'No Recent Data';
    if (daysSinceReading > 1) return 'Delayed';
    return 'Active';
  },

  getStatusColor: (sensor) => {
    const status = sensorService.getStatusText(sensor);
    switch (status) {
      case 'Active': return 'green';
      case 'Delayed': return 'yellow';
      case 'No Recent Data': return 'orange';
      case 'Inactive': return 'red';
      default: return 'gray';
    }
  },

  isCalibrationDue: (sensor) => {
    if (!sensor.lastCalibrated || !sensor.calibrationInterval) return false;
    
    const daysSinceCalibration = Math.floor(
      (new Date() - new Date(sensor.lastCalibrated)) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceCalibration > sensor.calibrationInterval;
  },

  formatSensorValue: (value, unit) => {
    if (value === null || value === undefined) return 'N/A';
    return `${parseFloat(value).toFixed(2)} ${unit || ''}`;
  },

  getSensorTypeIcon: (sensorType) => {
    const iconMap = {
      'Temperature': '🌡️',
      'Humidity': '💧',
      'Soil_Moisture': '🌱',
      'pH': '⚗️',
      'Light': '☀️',
      'Pressure': '📊',
      'Wind': '💨',
      'Rain': '🌧️'
    };
    return iconMap[sensorType] || '📡';
  }
};
