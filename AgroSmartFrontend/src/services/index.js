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

// Import user-specific services
import { userFarmService } from './userFarmService';
import { userCropService } from './userCropService';
import { userFieldService } from './userFieldService';
import { userFieldWiseCropService } from './userFieldWiseCropService';
import { userScheduleService } from './userScheduleService';
import { userSensorService } from './userSensorService';
import { userSensorReadingService } from './userSensorReadingService';
import { userSmartInsightService } from './userSmartInsightService';
import { userWeatherService } from './userWeatherService';

// Import admin-specific services
import { adminFieldWiseCropService } from './adminFieldWiseCropService';
import { adminFarmService } from './adminFarmService';
import { adminCropService } from './adminCropService';
import { adminFieldService } from './adminFieldService';
import { adminScheduleService } from './adminScheduleService';
import { adminSensorService } from './adminSensorService';
import { adminSensorReadingService } from './adminSensorReadingService';
import { adminSmartInsightService } from './adminSmartInsightService';
import { adminWeatherService } from './adminWeatherService';
import { adminUserService } from './adminUserService';
import { healthService } from './healthService';

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
  api,
  // User-specific services
  userFarmService,
  userCropService,
  userFieldService,
  userFieldWiseCropService,
  userScheduleService,
  userSensorService,
  userSensorReadingService,
  userSmartInsightService,
  userWeatherService,
  // Admin-specific services
  adminFieldWiseCropService,
  adminFarmService,
  adminCropService,
  adminFieldService,
  adminScheduleService,
  adminSensorService,
  adminSensorReadingService,
  adminSmartInsightService,
  adminWeatherService,
  adminUserService,
  healthService
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
  fieldWiseCrop: fieldWiseCropService,
  // User services
  userFarm: userFarmService,
  userField: userFieldService,
  userCrop: userCropService,
  userFieldWiseCrop: userFieldWiseCropService,
  // Admin services
  adminFarm: adminFarmService,
  adminField: adminFieldService,
  adminCrop: adminCropService,
  adminFieldWiseCrop: adminFieldWiseCropService
};

export const monitoringServices = {
  sensor: sensorService,
  sensorReading: sensorReadingService,
  weather: weatherService,
  realTimeWeather: realTimeWeatherService,
  // User services
  userSensor: userSensorService,
  userSensorReading: userSensorReadingService,
  userWeather: userWeatherService,
  // Admin services
  adminSensor: adminSensorService,
  adminSensorReading: adminSensorReadingService,
  adminWeather: adminWeatherService
};

export const planningServices = {
  schedule: scheduleService,
  smartInsight: smartInsightService,
  health: healthService,
  // User services
  userSchedule: userScheduleService,
  userSmartInsight: userSmartInsightService,
  // Admin services
  adminSchedule: adminScheduleService,
  adminSmartInsight: adminSmartInsightService
};

// Admin-only services
export const adminServices = {
  user: adminUserService,
  farm: adminFarmService,
  crop: adminCropService,
  field: adminFieldService,
  fieldWiseCrop: adminFieldWiseCropService,
  schedule: adminScheduleService,
  sensor: adminSensorService,
  sensorReading: adminSensorReadingService,
  smartInsight: adminSmartInsightService,
  weather: adminWeatherService,
  health: healthService
};

// User-only services  
export const userServices = {
  farm: userFarmService,
  crop: userCropService,
  field: userFieldService,
  fieldWiseCrop: userFieldWiseCropService,
  schedule: userScheduleService,
  sensor: userSensorService,
  sensorReading: userSensorReadingService,
  smartInsight: userSmartInsightService,
  weather: userWeatherService,
  profile: userService
};
