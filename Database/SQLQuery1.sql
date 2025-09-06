-- AgroSmart Precision Farming Dashboard - Complete SQL Schema
-- USE AgroSmart;

-- =============================================
-- 1. USERS TABLE
-- =============================================

CREATE TABLE Users (
    UserId			INT PRIMARY KEY IDENTITY(1,1),
    FullName		NVARCHAR(100) NOT NULL,
    Email			NVARCHAR(100) NOT NULL,
    PasswordHash	NVARCHAR(255) NOT NULL,
    Role			NVARCHAR(20) NOT NULL,
    Phone			NVARCHAR(15) NULL,
    Address			NVARCHAR(255) NULL,
    IsActive		BIT NOT NULL DEFAULT 1,
    CreatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt		DATETIME2 NOT NULL DEFAULT GETDATE()
);
-- add new column ProfileImage

ALTER TABLE Users
ADD ProfileImage NVARCHAR(500) NULL;

-- add new table PasswordResetTokens

CREATE TABLE PasswordResetTokens (
    Id			INT IDENTITY(1,1) PRIMARY KEY,
    UserId		INT NOT NULL,
    Token		NVARCHAR(255) NOT NULL,
    Expiry		DATETIME NOT NULL,
    CONSTRAINT FK_PasswordResetTokens_Users FOREIGN KEY (UserId)
        REFERENCES Users(UserId) ON DELETE CASCADE
);

select * from PasswordResetTokens;

-- Insert sample users
INSERT INTO Users (FullName, Email, PasswordHash, Role, Phone, Address) VALUES
('John Farmer', 'john@example.com', 'hashed_password_123', 'Farmer', '1234567890', '123 Farm Road'),
('Jane Expert', 'jane@example.com', 'hashed_password_456', 'Expert', '0987654321', '456 Expert Lane'),
('Admin User', 'admin@example.com', 'hashed_password_789', 'Admin', '1122334455', '789 Admin Street'),
('Ravi Singh', 'ravi.singh@example.com', 'hashed_pw_004', 'Farmer', '9876543210', '101 Green Valley'),
('Anita Verma', 'anita.verma@example.com', 'hashed_pw_005', 'Expert', '9876543211', '102 Knowledge Blvd'),
('Mohit Kumar', 'mohit.kumar@example.com', 'hashed_pw_006', 'Farmer', '9876543212', '103 Crop Street'),
('Priya Das', 'priya.das@example.com', 'hashed_pw_007', 'Expert', '9876543213', '104 Smart Farm'),
('Karan Patel', 'karan.patel@example.com', 'hashed_pw_008', 'Admin', '9876543214', '105 AgroTech HQ'),
('Neha Sharma', 'neha.sharma@example.com', 'hashed_pw_009', 'Farmer', '9876543215', '106 Eco Farms'),
('Deepak Roy', 'deepak.roy@example.com', 'hashed_pw_010', 'Expert', '9876543216', '107 Field Lane');

select * from Users;

-- =============================================
-- 2. FARMS TABLE
-- =============================================

CREATE TABLE Farms (
    FarmId			INT PRIMARY KEY IDENTITY(1,1),
    FarmName		NVARCHAR(100) NOT NULL,
    Location		NVARCHAR(255) NOT NULL,
    Latitude		DECIMAL(9,6) NULL,
    Longitude		DECIMAL(9,6) NULL,
    TotalAcres		DECIMAL(10,2) NULL,
    UserId			INT NOT NULL,
    IsActive		BIT NOT NULL DEFAULT 1,
    CreatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt		DATETIME2 NOT NULL DEFAULT GETDATE()

	-- Foreign Key Constraint
	CONSTRAINT FK_Farms_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Insert sample Farms
INSERT INTO Farms (FarmName, Location, Latitude, Longitude, TotalAcres, UserId) VALUES
('Green Horizon Farm', 'Village Alpha', 25.317645, 82.973914, 12.50, 1),
('Sunny Acres', 'Rural Zone 5', 24.876541, 85.007891, 20.00, 2),
('EcoGrow Estate', 'Farmbelt Region', 23.789654, 84.123456, 15.75, 1),
('Harvest Hill', 'Mountain Valley', 22.456987, 83.456789, 18.30, 2),
('Golden Fields', 'Riverbank Area', 21.876512, 82.987654, 25.00, 1),
('AgroBloom Farm', 'Western Patch', 26.000123, 81.654321, 10.40, 2),
('Sunrise Orchards', 'Foothill Plains', 23.654987, 80.456789, 30.00, 1),
('FreshSprout Fields', 'Irrigated Zone', 22.111222, 79.345678, 16.90, 2),
('NatureNest Farm', 'Delta District', 24.234567, 78.123456, 14.60, 1),
('PureHarvest Land', 'Hinterland South', 25.345678, 77.987654, 19.85, 2);

select * from Farms;  

-- =============================================
-- 3. CROPS TABLE
-- =============================================

CREATE TABLE Crops (
    CropId              INT PRIMARY KEY IDENTITY(1,1),
    CropName            NVARCHAR(100) NOT NULL,
    OptimalSoilpHMin    DECIMAL(4,2) NULL,
    OptimalSoilpHMax    DECIMAL(4,2) NULL,
    OptimalTempMin      DECIMAL(5,2) NULL,
    OptimalTempMax      DECIMAL(5,2) NULL,
    AvgWaterReqmm       DECIMAL(10,2) NULL,
    GrowthDurationDays  INT NULL,
    SeedingDepthCm      DECIMAL(5,2) NULL,
    HarvestSeason       NVARCHAR(20) NULL,
    Description         NVARCHAR(MAX) NULL,
    IsActive            BIT NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt           DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Insert sample crops
INSERT INTO Crops (CropName, OptimalSoilpHMin, OptimalSoilpHMax, OptimalTempMin, OptimalTempMax, AvgWaterReqmm, GrowthDurationDays, SeedingDepthCm, HarvestSeason, Description) VALUES
('Wheat', 6.0, 7.5, 15.0, 25.0, 450.0, 120, 2.5, 'Summer', 'Common wheat crop'),
('Corn', 5.8, 6.8, 20.0, 30.0, 600.0, 90, 3.0, 'Fall', 'Maize crop'),
('Tomato', 6.0, 6.8, 18.0, 27.0, 400.0, 75, 1.0, 'Summer', 'Tomato vegetable crop'),
('Rice', 5.5, 6.5, 20.0, 30.0, 1200.0, 150, 2.0, 'Summer', 'Rice grain crop'),
('Barley', 6.0, 7.0, 12.0, 25.0, 500.0, 90, 3.0, 'Fall', 'Barley cereal crop'),
('Potato', 5.5, 6.5, 10.0, 25.0, 600.0, 80, 4.0, 'Winter', 'Potato tuber crop'),
('Onion', 6.0, 7.0, 12.0, 24.0, 400.0, 100, 2.5, 'Year-round', 'Bulb vegetable'),
('Soybean', 6.0, 7.0, 20.0, 30.0, 500.0, 100, 3.0, 'Summer', 'Protein-rich legume'),
('Peanut', 5.5, 7.0, 25.0, 35.0, 400.0, 120, 4.0, 'Fall', 'Underground legume'),
('Cabbage', 6.0, 7.5, 10.0, 20.0, 350.0, 75, 1.5, 'Winter', 'Leafy vegetable crop');

select * from Crops;

-- =============================================
-- 4. FIELDS TABLE
-- =============================================

CREATE TABLE Fields (
    FieldId			INT PRIMARY KEY IDENTITY(1,1),
    FieldName		NVARCHAR(100) NOT NULL,
    SizeAcres		DECIMAL(10,2) NOT NULL,
    SoilType		NVARCHAR(50) NULL,
    IrrigationType	NVARCHAR(30) NULL,
    FarmId			INT NOT NULL,
    IsActive		BIT NOT NULL DEFAULT 1,
    CreatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),

    -- Foreign Key Constraints
    CONSTRAINT FK_Fields_Farms FOREIGN KEY (FarmId) REFERENCES Farms(FarmId)
);

-- Insert Sample Fields
INSERT INTO Fields (FieldName, SizeAcres, SoilType, IrrigationType, FarmId) VALUES
('Field A1', 2.50, 'Loamy', 'Drip', 1),
('Field A2', 3.75, 'Sandy', 'Sprinkler', 1),
('Field A3', 1.80, 'Clay', 'Flood', 1),
('Field A4', 4.25, 'Silty', 'Manual', 1),
('Field A5', 2.00, 'Peaty', 'Drip', 1),

('Field B1', 3.00, 'Loamy', 'Sprinkler', 2),
('Field B2', 2.70, 'Clay', 'Drip', 2),
('Field B3', 1.90, 'Sandy', 'Manual', 2),
('Field B4', 4.10, 'Silty', 'Flood', 2),
('Field B5', 3.25, 'Loamy', 'Drip', 2);

select * from Fields;

-- =============================================
-- 5. SENSORS TABLE
-- =============================================

CREATE TABLE Sensors (
    SensorId				INT PRIMARY KEY IDENTITY(1,1),
    SensorType				NVARCHAR(50) NOT NULL,
    Manufacturer			NVARCHAR(100),
    Model					NVARCHAR(100),
    SerialNumber			NVARCHAR(100),
    FieldId					INT NOT NULL,
    InstallationDate		DATETIME2,
    LastCalibrated			DATETIME2,
    CalibrationInterval		INT,
    LatestValue				DECIMAL(15,4),
    LatestUnit				NVARCHAR(20),
    LatestQualityScore		DECIMAL(3,2) CHECK (LatestQualityScore BETWEEN 0 AND 1),
    LastReadingTime			DATETIME2,
    IsActive				BIT NOT NULL DEFAULT 1,
    CreatedAt				DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Sensors_Fields FOREIGN KEY (FieldId) REFERENCES Fields(FieldId)
);

--Insert Sample Sensors
INSERT INTO Sensors (SensorType, Manufacturer, Model, SerialNumber, FieldId, InstallationDate, LastCalibrated, CalibrationInterval, LatestValue, LatestUnit, LatestQualityScore, LastReadingTime)
VALUES
('Temperature', 'AgroSense', 'T-100', 'SN-T100-001', 1, '2024-01-10', '2024-06-01', 180, 27.5, '°C', 0.95, '2025-07-07 10:00:00'),
('Humidity', 'CropTech', 'H-200', 'SN-H200-002', 2, '2024-02-15', '2024-06-15', 90, 68.2, '%', 0.89, '2025-07-07 10:05:00'),
('Soil_Moisture', 'FarmBotics', 'SM-300', 'SN-SM300-003', 1, '2024-03-12', '2024-07-01', 120, 23.4, '%', 0.92, '2025-07-07 09:50:00'),
('pH', 'SoilCheck', 'PH-101', 'SN-PH101-004', 3, '2023-12-01', '2024-06-01', 180, 6.8, 'pH', 0.98, '2025-07-07 08:40:00'),
('Light', 'AgroSense', 'LUX-500', 'SN-LUX500-005', 2, '2024-01-20', '2024-06-20', 365, 12000, 'Lux', 0.93, '2025-07-07 11:00:00'),
('Pressure', 'AgroWeather', 'P-400', 'SN-P400-006', 4, '2024-04-01', '2024-07-01', 60, 1013.25, 'hPa', 0.90, '2025-07-07 07:30:00'),
('Wind', 'WindX', 'W-600', 'SN-W600-007', 3, '2024-03-01', '2024-06-30', 60, 15.4, 'km/h', 0.88, '2025-07-07 08:10:00'),
('Rain', 'RainMate', 'R-700', 'SN-R700-008', 1, '2024-02-28', '2024-06-15', 90, 5.6, 'mm', 0.85, '2025-07-07 09:20:00'),
('Humidity', 'CropTech', 'H-201', 'SN-H201-009', 4, '2024-04-12', '2024-07-01', 60, 72.1, '%', 0.91, '2025-07-07 10:45:00'),
('Temperature', 'AgroSense', 'T-101', 'SN-T101-010', 2, '2024-03-18', '2024-06-18', 180, 29.8, '°C', 0.94, '2025-07-07 11:15:00');

select * from Sensors;

-- =============================================
-- 6. SensorReadings TABLE
-- =============================================

CREATE TABLE SensorReadings (
    ReadingId		BIGINT PRIMARY KEY IDENTITY(1,1),
    SensorId		INT NOT NULL,
    Value			DECIMAL(15,4) NOT NULL,
    Unit			NVARCHAR(20),
    QualityScore	DECIMAL(3,2) CHECK (QualityScore BETWEEN 0 AND 1),
    ReadingTime		DATETIME2 NOT NULL,

    CONSTRAINT FK_SensorReadings_Sensors FOREIGN KEY (SensorId) REFERENCES Sensors(SensorId)
);

--Insert Sample SensorReadings
INSERT INTO SensorReadings (SensorId, Value, Unit, QualityScore, ReadingTime)
VALUES
(1, 27.4, '°C', 0.96, '2025-07-07 10:10:00'),
(2, 67.9, '%', 0.88, '2025-07-07 10:15:00'),
(3, 24.1, '%', 0.91, '2025-07-07 10:20:00'),
(4, 6.9, 'pH', 0.97, '2025-07-07 10:25:00'),
(5, 11800, 'Lux', 0.92, '2025-07-07 10:30:00'),
(6, 1012.90, 'hPa', 0.89, '2025-07-07 10:35:00'),
(7, 14.8, 'km/h', 0.87, '2025-07-07 10:40:00'),
(8, 6.0, 'mm', 0.86, '2025-07-07 10:45:00'),
(9, 70.5, '%', 0.90, '2025-07-07 10:50:00'),
(10, 28.9, '°C', 0.95, '2025-07-07 10:55:00');

select * from SensorReadings;

-- =============================================
-- 7. FIELDWISECROPS TABLE
-- =============================================

CREATE TABLE FieldWiseCrops (
    FieldWiseCropId		INT PRIMARY KEY IDENTITY(1,1),
    FieldId				INT NOT NULL,
    CropId				INT NOT NULL,
    PlantedDate			DATE NOT NULL,
    ExpectedHarvestDate DATE NULL,
    ActualHarvestDate	DATE NULL,
    CurrentGrowthStage	NVARCHAR(50) NULL,
    PlantedArea			DECIMAL(10,2) NULL,
    Status				NVARCHAR(20) NOT NULL DEFAULT 'Active',
    Notes				NVARCHAR(MAX) NULL,
    CreatedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_FieldWiseCrops_Fields FOREIGN KEY (FieldId) REFERENCES Fields(FieldId),
    CONSTRAINT FK_FieldWiseCrops_Crops FOREIGN KEY (CropId) REFERENCES Crops(CropId)

);

-- Insert Sample FieldWiseCrops
INSERT INTO FieldWiseCrops (FieldId, CropId, PlantedDate, ExpectedHarvestDate, ActualHarvestDate, CurrentGrowthStage, PlantedArea, Status, Notes) VALUES
(1, 1, '2025-03-15', '2025-07-15', NULL, 'Vegetative', 2.50, 'Active', 'Healthy crop growth observed.'),
(2, 2, '2025-03-20', '2025-06-20', NULL, 'Flowering', 3.00, 'Active', 'Needs light irrigation.'),
(1, 3, '2025-02-10', '2025-05-15', '2025-05-12', 'Harvested', 2.80, 'Harvested', 'Yield slightly below average.'),
(2, 4, '2025-01-05', '2025-04-10', '2025-04-09', 'Maturity', 3.50, 'Harvested', 'Crop successfully harvested.'),
(1, 5, '2025-04-01', '2025-08-01', NULL, 'Seedling', 1.75, 'Active', 'Early stage - good progress.'),
(2, 1, '2025-02-01', '2025-06-01', '2025-05-25', 'Harvested', 2.90, 'Harvested', 'Above-average yield.'),
(1, 2, '2025-03-10', '2025-06-25', NULL, 'Fruiting', 2.30, 'Active', 'Requires pest control.'),
(2, 3, '2025-01-20', '2025-05-20', NULL, 'Failed', 3.10, 'Failed', 'Flooding caused crop loss.'),
(1, 4, '2025-02-18', '2025-06-20', NULL, 'Vegetative', 2.70, 'Active', 'Leaf growth healthy.'),
(2, 5, '2025-04-10', '2025-08-15', NULL, 'Seedling', 3.20, 'Active', 'Proper germination observed.');

select * from FieldWiseCrops;

-- =============================================
-- 8. SmartInsights TABLE
-- =============================================

CREATE TABLE SmartInsights (
    InsightId            INT PRIMARY KEY IDENTITY(1,1),
    InsightType          NVARCHAR(50) NOT NULL,         -- e.g., 'Alert', 'Tip', 'Schedule', 'Sensor', 'Crop'
    Title                NVARCHAR(200) NOT NULL,
    Message              NVARCHAR(MAX) NOT NULL,
    Priority             NVARCHAR(20) DEFAULT 'Medium', -- High, Medium, Low
    Status               NVARCHAR(20) DEFAULT 'Active', -- Seen, Resolved, etc.
    SourceType           NVARCHAR(50),                  -- e.g., 'Sensor', 'Schedule', 'Field', 'Farm', 'AI'
    TargetUserId         INT NOT NULL,                  -- Who should see this insight
    ValidUntil           DATETIME2 NULL,
    CreatedAt            DATETIME2 DEFAULT GETDATE(),
    IsResolved           BIT DEFAULT 0,
    
    CONSTRAINT FK_SmartInsights_Users FOREIGN KEY (TargetUserId) REFERENCES Users(UserId)
);

-- Insert Sample SmartInsights
INSERT INTO SmartInsights (InsightType, Title, Message, Priority, Status, SourceType, TargetUserId, ValidUntil)
VALUES 
-- Sensor Alert
('Alert', 'Soil Moisture Low', 
 'Sensor in Field A1 shows critically low soil moisture. Irrigation required immediately.',
 'High', 'Active', 'Sensor', 1, '2025-07-10'),

-- Field Recommendation
('Recommendation', 'Apply Potassium Fertilizer', 
 'Field A2 crops entering fruiting stage. Recommend potassium-based fertilizer this week.',
 'Medium', 'Active', 'Field', 1, '2025-07-15'),

-- Schedule Reminder
('Reminder', 'Upcoming Irrigation Task', 
 'Drip irrigation scheduled on Field A1 for 8:00 AM tomorrow. Ensure setup is ready.',
 'Low', 'Active', 'Schedule', 1, '2025-07-08'),

-- General Tip
('Tip', 'Use Organic Pest Control', 
 'Using neem-based insecticide can help reduce pests without affecting crop quality.',
 'Low', 'Active', 'Field', 1, NULL),

-- Farm-Level Insight
('Recommendation', 'Switch to Drip Irrigation System', 
 'Farm-wide water usage can be optimized with a drip system, reducing 40% waste.',
 'High', 'Active', 'Farm', 1, '2025-08-01'),

-- Weather Alert
('Alert', 'Rain Forecasted Tomorrow', 
 'Rainfall expected near Agro Farm A. Consider rescheduling pesticide spray.',
 'High', 'Active', 'Farm', 1, '2025-07-08'),

-- AI Crop Suggestion
('Recommendation', 'Rotate Crop to Legumes', 
 'AI suggests rotating with Soybean after wheat to restore soil nitrogen levels.',
 'Medium', 'Active', 'Field', 2, '2025-12-31'),

-- Harvest Reminder
('Reminder', 'Tomato Harvest Approaching', 
 'Field A3 tomatoes are nearing full maturity. Begin harvest planning now.',
 'Medium', 'Active', 'Schedule', 1, '2025-07-09'),

-- Sensor Alert - pH too acidic
('Alert', 'Soil pH Too Low', 
 'Sensor in Field A3 shows pH 4.9. Apply lime to correct acidity.',
 'High', 'Active', 'Sensor', 1, '2025-07-11'),

-- Expert Tip
('Tip', 'Mulching Benefits', 
 'Mulching helps retain soil moisture and suppress weeds. Consider applying mulch.',
 'Low', 'Active', 'Farm', 1, NULL);

 select * from SmartInsights;

-- =============================================
-- 9. SCHEDULES TABLE
-- =============================================

CREATE TABLE Schedules (
    ScheduleId			INT PRIMARY KEY IDENTITY(1,1),
    FieldId				INT NOT NULL,
    ScheduleType		NVARCHAR(50) NOT NULL,
    Title				NVARCHAR(200) NOT NULL,
    Description			NVARCHAR(MAX) NULL,
    ScheduledDate		DATETIME2 NOT NULL,
    Duration			DECIMAL(5,2) NULL,
    EstimatedCost		DECIMAL(10,2) NULL,
    Priority			NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    Status				NVARCHAR(20) NOT NULL DEFAULT 'Scheduled',
    IsCompleted			BIT NOT NULL DEFAULT 0,
    CreatedBy			INT NOT NULL,
    CreatedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_Schedules_Fields FOREIGN KEY (FieldId) REFERENCES Fields(FieldId),
    CONSTRAINT FK_Schedules_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)

);

-- Insert Sample Schedules
INSERT INTO Schedules (FieldId, ScheduleType, Title, Description, ScheduledDate, Duration, EstimatedCost, Priority, Status, IsCompleted, CreatedBy) VALUES
(1, 'Irrigation', 'Early Morning Irrigation', 'Irrigate fields to maintain soil moisture.', '2025-07-02 06:00:00', 2.00, 300.00, 'High', 'Scheduled', 0, 1),
(2, 'Fertilization', 'Apply Urea Fertilizer', 'Apply recommended nitrogen fertilizer before rain.', '2025-07-03 08:00:00', 1.50, 250.00, 'Medium', 'Scheduled', 0, 2),
(1, 'Pest Control', 'Spray Neem Oil', 'Eco-friendly pest control to reduce aphid attack.', '2025-07-04 07:00:00', 1.00, 150.00, 'Low', 'Scheduled', 0, 1),
(2, 'Soil Testing', 'Test for pH and Nutrients', 'Lab test scheduled for soil sample analysis.', '2025-07-05 10:00:00', 2.50, 500.00, 'Medium', 'Scheduled', 0, 2),
(1, 'Harvest', 'Tomato Harvesting', 'Expected harvest window for tomato field.', '2025-07-06 05:30:00', 3.00, 0.00, 'High', 'Scheduled', 0, 1),
(2, 'Irrigation', 'Evening Drip Irrigation', 'Automated drip irrigation for water-saving.', '2025-07-02 18:00:00', 1.00, 200.00, 'Low', 'Scheduled', 0, 2),
(1, 'Fertilization', 'Potassium Supplement', 'Improve crop fruiting stage with potassium.', '2025-07-08 09:00:00', 1.25, 180.00, 'Medium', 'Scheduled', 0, 1),
(2, 'Weed Removal', 'Manual Weeding', 'Routine weed management by labor.', '2025-07-09 07:00:00', 2.00, 100.00, 'Medium', 'Scheduled', 0, 2),
(1, 'Field Inspection', 'Expert Crop Checkup', 'Agricultural expert will inspect crop health.', '2025-07-10 08:30:00', 1.75, 0.00, 'High', 'Scheduled', 0, 1),
(2, 'Pest Control', 'Deploy Traps', 'Pheromone traps installation.', '2025-07-11 07:30:00', 1.00, 120.00, 'Low', 'Scheduled', 0, 2);

select * from Schedules;

-- =============================================
-- 10. WEATHERDATA TABLE
-- =============================================

CREATE TABLE WeatherData (
    WeatherId            BIGINT PRIMARY KEY IDENTITY(1,1),
    Location             NVARCHAR(255) NOT NULL,
    Latitude             DECIMAL(9,6) NOT NULL,
    Longitude            DECIMAL(9,6) NOT NULL,
    Temperature          DECIMAL(5,2) NULL,
    Humidity             DECIMAL(5,2) NULL,
    Pressure             DECIMAL(7,2) NULL,
    WindSpeed            DECIMAL(5,2) NULL,
    WeatherDescription   NVARCHAR(200) NULL,
    ForecastDate         DATETIME2 NOT NULL,
    DataType             NVARCHAR(20) NOT NULL,
    RetrievedAt          DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Insert sample WeatherData
INSERT INTO WeatherData (Location, Latitude, Longitude, Temperature, Humidity,Pressure, WindSpeed, WeatherDescription, ForecastDate, DataType
) VALUES
('Agro Farm A', 26.8467, 80.9462, 32.5, 60.0, 1012.5, 5.5, 'Partly Cloudy',   '2025-07-02 09:00:00', 'Current'),
('Agro Farm B', 26.8467, 80.9462, 31.2, 65.0, 1010.8, 4.8, 'Sunny',            '2025-07-02 12:00:00', 'Hourly'),
('Agro Farm A', 26.8467, 80.9462, 30.0, 68.0, 1009.2, 3.7, 'Humid',            '2025-07-03 06:00:00', 'Daily'),
('Agro Farm B', 26.8467, 80.9462, 33.5, 55.0, 1011.3, 6.2, 'Hot',              '2025-07-03 09:00:00', 'Current'),
('Agro Farm A', 26.8467, 80.9462, 29.8, 70.0, 1008.5, 2.0, 'Cloudy',           '2025-07-04 09:00:00', 'Daily'),
('Agro Farm C', 26.7890, 80.9950, 34.0, 52.0, 1014.0, 7.0, 'Clear Skies',      '2025-07-02 18:00:00', 'Hourly'),
('Agro Farm D', 26.7600, 80.9200, 28.5, 75.0, 1005.0, 3.5, 'Light Rain',       '2025-07-03 15:00:00', 'Current'),
('Agro Farm E', 26.8800, 80.9800, 27.2, 80.0, 1003.2, 2.5, 'Heavy Rain',       '2025-07-04 08:00:00', 'Daily'),
('Agro Farm B', 26.8467, 80.9462, 32.0, 62.0, 1013.3, 5.2, 'Sunny Intervals',  '2025-07-05 12:00:00', 'Hourly'),
('Agro Farm C', 26.7890, 80.9950, 30.5, 69.0, 1007.7, 4.0, 'Overcast',         '2025-07-06 07:00:00', 'Daily');

select * from WeatherData;
