# AgroSmart Frontend Services Documentation

## Overview
This document provides a comprehensive overview of all services in the AgroSmart frontend application, organized by functionality and access level.

## Service Architecture

### 🔐 Authentication Services
- **authService.js** - Handles user authentication and authorization
- **userService.js** - User management and profile operations

### 👤 User-Specific Services (Ownership-based access)
- **userFarmService.js** - Farm operations for current user
- **userCropService.js** - Crop operations for current user  
- **userFieldService.js** - Field operations for current user
- **userFieldWiseCropService.js** - FieldWiseCrop operations for current user
- **userScheduleService.js** - Schedule operations for current user
- **userSensorService.js** - Sensor operations for current user
- **userSensorReadingService.js** - Sensor reading operations for current user
- **userSmartInsightService.js** - Smart insight operations for current user
- **userWeatherService.js** - Weather data operations for current user

### 👨‍💼 Admin Services (Full access)
- **adminFarmService.js** - Full farm management
- **adminCropService.js** - Full crop management
- **adminFieldService.js** - Full field management
- **adminFieldWiseCropService.js** - Full field-wise crop management
- **adminScheduleService.js** - Full schedule management
- **adminSensorService.js** - Full sensor management
- **adminSensorReadingService.js** - Full sensor reading management
- **adminSmartInsightService.js** - Full smart insight management
- **adminWeatherService.js** - Full weather data management
- **adminUserService.js** - User management for admins

### 🏥 System Services
- **healthService.js** - System health monitoring

## API Endpoint Mapping

### Authentication Endpoints
| Method | Endpoint | Service | Function |
|--------|----------|---------|----------|
| POST | /api/Auth/Login | authService | login() |
| POST | /api/Auth/Register | authService | register() |
| POST | /api/Auth/ChangePassword | authService | changePassword() |
| POST | /api/Auth/request-password-reset | authService | requestPasswordReset() |
| POST | /api/Auth/reset-password | authService | resetPassword() |

### Crop Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/Crop/All | userCropService | adminCropService | getAllCrops() |
| GET | /api/Crop/{id} | userCropService | adminCropService | getCropById(id) |
| PUT | /api/Crop/{id} | userCropService | adminCropService | updateCrop(id, data) |
| DELETE | /api/Crop/{id} | userCropService | adminCropService | deleteCrop(id) |
| POST | /api/Crop | userCropService | adminCropService | createCrop(data) |
| GET | /api/Crop/dropdown | userCropService | adminCropService | getCropDropdown() |
| GET | /api/Crop/Filter | userCropService | adminCropService | filterCrops(params) |

### Farm Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/Farm/All | userFarmService | adminFarmService | getAllFarms() |
| GET | /api/Farm/{id} | userFarmService | adminFarmService | getFarmById(id) |
| PUT | /api/Farm/{id} | userFarmService | adminFarmService | updateFarm(id, data) |
| DELETE | /api/Farm/{id} | userFarmService | adminFarmService | deleteFarm(id) |
| POST | /api/Farm | userFarmService | adminFarmService | createFarm(data) |
| GET | /api/Farm/dropdown | userFarmService | adminFarmService | getFarmDropdown() |
| GET | /api/Farm/filter | userFarmService | adminFarmService | filterFarms(params) |

### Field Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/Field/All | userFieldService | adminFieldService | getAllFields() |
| GET | /api/Field/{id} | userFieldService | adminFieldService | getFieldById(id) |
| PUT | /api/Field/{id} | userFieldService | adminFieldService | updateField(id, data) |
| DELETE | /api/Field/{id} | userFieldService | adminFieldService | deleteField(id) |
| POST | /api/Field | userFieldService | adminFieldService | createField(data) |
| GET | /api/Field/dropdown | userFieldService | adminFieldService | getFieldDropdown() |
| GET | /api/Field/filter | userFieldService | adminFieldService | filterFields(params) |

### FieldWiseCrop Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/FieldWiseCrop/All | userFieldWiseCropService | adminFieldWiseCropService | getAllFieldWiseCrops() |
| GET | /api/FieldWiseCrop/{id} | userFieldWiseCropService | adminFieldWiseCropService | getFieldWiseCropById(id) |
| PUT | /api/FieldWiseCrop/{id} | userFieldWiseCropService | adminFieldWiseCropService | updateFieldWiseCrop(id, data) |
| DELETE | /api/FieldWiseCrop/{id} | userFieldWiseCropService | adminFieldWiseCropService | deleteFieldWiseCrop(id) |
| POST | /api/FieldWiseCrop | userFieldWiseCropService | adminFieldWiseCropService | createFieldWiseCrop(data) |
| GET | /api/FieldWiseCrop/filter | userFieldWiseCropService | adminFieldWiseCropService | filterFieldWiseCrops(params) |

### Health Endpoints
| Method | Endpoint | Service | Function |
|--------|----------|---------|----------|
| GET | /api/Health | healthService | getSystemHealth() |

### Schedule Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/Schedule/All | userScheduleService | adminScheduleService | getAllSchedules() |
| GET | /api/Schedule/{id} | userScheduleService | adminScheduleService | getScheduleById(id) |
| PUT | /api/Schedule/{id} | userScheduleService | adminScheduleService | updateSchedule(id, data) |
| DELETE | /api/Schedule/{id} | userScheduleService | adminScheduleService | deleteSchedule(id) |
| POST | /api/Schedule | userScheduleService | adminScheduleService | createSchedule(data) |
| GET | /api/Schedule/Filter | userScheduleService | adminScheduleService | filterSchedules(params) |

### Sensor Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/Sensor/All | userSensorService | adminSensorService | getAllSensors() |
| GET | /api/Sensor/{id} | userSensorService | adminSensorService | getSensorById(id) |
| PUT | /api/Sensor/{id} | userSensorService | adminSensorService | updateSensor(id, data) |
| DELETE | /api/Sensor/{id} | userSensorService | adminSensorService | deleteSensor(id) |
| POST | /api/Sensor | userSensorService | adminSensorService | createSensor(data) |
| GET | /api/Sensor/Dropdown | userSensorService | adminSensorService | getSensorDropdown() |
| GET | /api/Sensor/Filter | userSensorService | adminSensorService | filterSensors(params) |

### SensorReading Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/SensorReading/All | userSensorReadingService | adminSensorReadingService | getAllSensorReadings() |
| GET | /api/SensorReading/{id} | userSensorReadingService | adminSensorReadingService | getSensorReadingById(id) |
| PUT | /api/SensorReading/{id} | userSensorReadingService | adminSensorReadingService | updateSensorReading(id, data) |
| DELETE | /api/SensorReading/{id} | userSensorReadingService | adminSensorReadingService | deleteSensorReading(id) |
| POST | /api/SensorReading | userSensorReadingService | adminSensorReadingService | createSensorReading(data) |
| GET | /api/SensorReading/Filter | userSensorReadingService | adminSensorReadingService | filterSensorReadings(params) |

### SmartInsight Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/SmartInsight/All | userSmartInsightService | adminSmartInsightService | getAllSmartInsights() |
| GET | /api/SmartInsight/{id} | userSmartInsightService | adminSmartInsightService | getSmartInsightById(id) |
| PUT | /api/SmartInsight/{id} | userSmartInsightService | adminSmartInsightService | updateSmartInsight(id, data) |
| DELETE | /api/SmartInsight/{id} | userSmartInsightService | adminSmartInsightService | deleteSmartInsight(id) |
| POST | /api/SmartInsight | userSmartInsightService | adminSmartInsightService | createSmartInsight(data) |
| GET | /api/SmartInsight/Filter | userSmartInsightService | adminSmartInsightService | filterSmartInsights(params) |

### User Endpoints
| Method | Endpoint | Service | Function |
|--------|----------|---------|----------|
| GET | /api/User/All | adminUserService | getAllUsers() |
| GET | /api/User/{id} | userService/adminUserService | getUserById(id) |
| PUT | /api/User/{id} | userService/adminUserService | updateUser(id, data) |
| DELETE | /api/User/SoftDelete/{id} | adminUserService | softDeleteUser(id) |
| DELETE | /api/User/HardDelete/{id} | adminUserService | hardDeleteUser(id) |
| GET | /api/User/Filter | adminUserService | filterUsers(params) |
| POST | /api/User/{id}/UploadProfilePicture | userService | uploadProfilePicture(id, file) |
| DELETE | /api/User/{id}/DeleteProfilePicture | userService | deleteProfilePicture(id) |

### WeatherData Endpoints
| Method | Endpoint | User Service | Admin Service | Function |
|--------|----------|--------------|---------------|----------|
| GET | /api/WeatherData/All | userWeatherService | adminWeatherService | getAllWeatherData() |
| GET | /api/WeatherData/{id} | userWeatherService | adminWeatherService | getWeatherDataById(id) |
| PUT | /api/WeatherData/{id} | userWeatherService | adminWeatherService | updateWeatherData(id, data) |
| DELETE | /api/WeatherData/{id} | userWeatherService | adminWeatherService | deleteWeatherData(id) |
| POST | /api/WeatherData | userWeatherService | adminWeatherService | createWeatherData(data) |
| GET | /api/WeatherData/TopTemperatures | userWeatherService | adminWeatherService | getTopTemperatures() |
| GET | /api/WeatherData/Filter | userWeatherService | adminWeatherService | filterWeatherData(params) |

## Service Structure Guidelines

### User Services
- Automatically inject user context (userId) for ownership validation
- Filter results to show only user-owned entities
- Include ownership checks before operations
- Use standard REST endpoints with user context

### Admin Services  
- Full access to all entities without ownership restrictions
- Administrative operations like bulk updates, system management
- User management capabilities (soft/hard delete)
- System-wide analytics and reporting

### Authentication Flow
1. User authenticates via authService
2. JWT token stored and automatically included in requests
3. Backend validates token and enforces ownership rules
4. Services handle 403/401 errors gracefully

## Implementation Status

### ✅ Completed Services
- **Authentication Services:**
  - authService.js ✅
  - userService.js ✅

- **User Services (Ownership-based):**
  - userFarmService.js ✅  
  - userCropService.js ✅
  - userFieldService.js ✅
  - userFieldWiseCropService.js ✅
  - userScheduleService.js ✅
  - userSensorService.js ✅
  - userSensorReadingService.js ✅
  - userSmartInsightService.js ✅
  - userWeatherService.js ✅

- **Admin Services (Full access):**
  - adminFieldWiseCropService.js ✅
  - adminFarmService.js ✅
  - adminCropService.js ✅
  - adminFieldService.js ✅
  - adminScheduleService.js ✅
  - adminSensorService.js ✅
  - adminSensorReadingService.js ✅
  - adminSmartInsightService.js ✅
  - adminWeatherService.js ✅
  - adminUserService.js ✅

- **System Services:**
  - healthService.js ✅

### 🔄 Legacy Services (Still Available)
- farmService.js
- cropService.js
- fieldService.js
- sensorService.js
- weatherService.js
- scheduleService.js
- smartInsightService.js
- fieldWiseCropService.js
- sensorReadingService.js
- realTimeWeatherService.js

## Service Implementation Complete! 🎉

**Total Services Created: 21**
- User Services: 9
- Admin Services: 10  
- Authentication/System Services: 2

All API endpoints from your backend are now fully covered with both user and admin service implementations.

## Next Steps
1. ✅ Create all remaining user services - **COMPLETED**
2. ✅ Create all remaining admin services - **COMPLETED**  
3. 🔄 Update components to use appropriate services - **IN PROGRESS**
4. 🔄 Test ownership validation - **PENDING**
5. 🔄 Implement admin interface components - **PENDING**

## Quick Reference

### For User Components
```javascript
// Import user services
import { userFarmService } from '../services/userFarmService';
import { userCropService } from '../services/userCropService';
import { userFieldService } from '../services/userFieldService';

// Usage example
const farms = await userFarmService.getAllUserFarms();
const crops = await userCropService.getAllUserCrops();
```

### For Admin Components  
```javascript
// Import admin services
import { adminFarmService } from '../services/adminFarmService';
import { adminUserService } from '../services/adminUserService';

// Usage example
const allFarms = await adminFarmService.getAllFarms();
const allUsers = await adminUserService.getAllUsers();
```

### Service Groups (from index.js)
```javascript
// Import grouped services
import { userServices, adminServices, farmManagementServices } from '../services';

// Usage
const farms = await userServices.farm.getAllUserFarms();
const users = await adminServices.user.getAllUsers();
```
