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
import realTimeWeatherService from './realTimeWeatherService';
import { authService } from './authService'; // ✅ Import auth service
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
  realTimeWeatherService,
  authService, // ✅ Export auth service
  api
};

// Export grouped services
export const authServices = {
  user: userService,
  auth: authService // ✅ Add to auth services group
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
  weather: weatherService,
  realTimeWeather: realTimeWeatherService
};

export const planningServices = {
  schedule: scheduleService,
  smartInsight: smartInsightService
};
