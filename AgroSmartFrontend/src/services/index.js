// Import services first
import farmService from './farmService';
import cropService from './cropService';
import fieldService from './fieldService';
import sensorService from './sensorService';
import weatherService from './weatherService';
import userService from './userService'; // ✅ imported before usage
import scheduleService from './scheduleService';
import smartInsightService from './smartInsightService';
import fieldWiseCropService from './fieldWiseCropService';
import sensorReadingService from './sensorReadingService';
import api from './api'; // base axios instance

// Export all as named exports
export {
  farmService,
  cropService,
  fieldService,
  sensorService,
  weatherService,
  userService,
  scheduleService,
  smartInsightService,
  fieldWiseCropService,
  sensorReadingService,
  api
};

// Export grouped services
export const authServices = {
  user: userService
};

export const farmManagementServices = {
  farm: farmService,
  field: fieldService,
  crop: cropService,
  fieldWiseCrop: fieldWiseCropService
};

export const monitoringServices = {
  sensor: sensorService,
  sensorReading: sensorReadingService,
  weather: weatherService
};

export const planningServices = {
  schedule: scheduleService,
  smartInsight: smartInsightService
};
