-- AgroSmart Precision Farming Dashboard - Complete SQL Schema
-- USE AgroSmart;

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE Users (
    UserId			INT NOT NULL IDENTITY(1,1),
    FullName		NVARCHAR(100) NOT NULL,
    Email			NVARCHAR(100) NOT NULL,
    PasswordHash	NVARCHAR(255) NOT NULL,
    Role			NVARCHAR(20) NOT NULL,
    Phone			NVARCHAR(15) NULL,
    Address			NVARCHAR(255) NULL,
    IsActive		BIT NOT NULL DEFAULT 1,
    CreatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Primary Key Constraint
    CONSTRAINT PK_Users PRIMARY KEY (UserId),
    
    -- Unique Constraints
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    
    -- Check Constraints
    CONSTRAINT CK_Users_Role CHECK (Role IN ('Farmer', 'Expert', 'Admin')),
    CONSTRAINT CK_Users_Email_Format CHECK (Email LIKE '%@%.%'),
    CONSTRAINT CK_Users_Phone_Format CHECK (Phone IS NULL OR Phone LIKE '[0-9]%')
);

select * from Users;

-- =============================================
-- 2. FARMS TABLE
-- =============================================
CREATE TABLE Farms (
    FarmId			INT NOT NULL IDENTITY(1,1),
    FarmName		NVARCHAR(100) NOT NULL,
    Location		NVARCHAR(255) NOT NULL,
    Latitude		DECIMAL(9,6) NULL,
    Longitude		DECIMAL(9,6) NULL,
    TotalAcres		DECIMAL(10,2) NULL,
    UserId			INT NOT NULL,
    IsActive		BIT NOT NULL DEFAULT 1,
    CreatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Primary Key Constraint
    CONSTRAINT PK_Farms PRIMARY KEY (FarmId),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_Farms_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    
    -- Check Constraints
    CONSTRAINT CK_Farms_FarmName_NotEmpty CHECK (LEN(LTRIM(RTRIM(FarmName))) > 0),
    CONSTRAINT CK_Farms_Location_NotEmpty CHECK (LEN(LTRIM(RTRIM(Location))) > 0),
);

-- =============================================
-- 3. CROPS TABLE
-- =============================================
CREATE TABLE Crops (
    CropId				INT NOT NULL IDENTITY(1,1),
    CropName			NVARCHAR(100) NOT NULL,
    OptimalSoilpHMin	DECIMAL(4,2) NULL,
    OptimalSoilpHMax	DECIMAL(4,2) NULL,
    OptimalTempMin		DECIMAL(5,2) NULL,
    OptimalTempMax		DECIMAL(5,2) NULL,
    AvgWaterReqmm		DECIMAL(10,2) NULL,
    GrowthDurationDays	INT NULL,
    SeedingDepthCm		DECIMAL(5,2) NULL,
    HarvestSeason		NVARCHAR(20) NULL,
    Description			NVARCHAR(MAX) NULL,
    IsActive			BIT NOT NULL DEFAULT 1,
    CreatedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Primary Key Constraint
    CONSTRAINT PK_Crops PRIMARY KEY (CropId),
    
    -- Unique Constraints
    CONSTRAINT UQ_Crops_CropName UNIQUE (CropName),
    
    -- Check Constraints
    CONSTRAINT CK_Crops_CropName_NotEmpty CHECK (LEN(LTRIM(RTRIM(CropName))) > 0),
    CONSTRAINT CK_Crops_SoilpHMin CHECK (OptimalSoilpHMin IS NULL OR (OptimalSoilpHMin BETWEEN 0 AND 14)),
    CONSTRAINT CK_Crops_SoilpHMax CHECK (OptimalSoilpHMax IS NULL OR (OptimalSoilpHMax BETWEEN 0 AND 14)),
    CONSTRAINT CK_Crops_pH_Range CHECK (
        (OptimalSoilpHMin IS NULL OR OptimalSoilpHMax IS NULL) OR 
        (OptimalSoilpHMin <= OptimalSoilpHMax)
    ),
    CONSTRAINT CK_Crops_TempMin CHECK (OptimalTempMin IS NULL OR OptimalTempMin >= -50),
    CONSTRAINT CK_Crops_TempMax CHECK (OptimalTempMax IS NULL OR OptimalTempMax <= 70),
    CONSTRAINT CK_Crops_Temp_Range CHECK (
        (OptimalTempMin IS NULL OR OptimalTempMax IS NULL) OR 
        (OptimalTempMin <= OptimalTempMax)
    ),
    CONSTRAINT CK_Crops_WaterReq CHECK (AvgWaterReqmm IS NULL OR AvgWaterReqmm >= 0),
    CONSTRAINT CK_Crops_GrowthDuration CHECK (GrowthDurationDays IS NULL OR GrowthDurationDays > 0),
    CONSTRAINT CK_Crops_SeedingDepth CHECK (SeedingDepthCm IS NULL OR SeedingDepthCm >= 0),
    CONSTRAINT CK_Crops_HarvestSeason CHECK (
        HarvestSeason IS NULL OR 
        HarvestSeason IN ('Spring', 'Summer', 'Fall', 'Winter', 'Year-round')
    )
);

select * from Crops;

-- =============================================
-- 4. FIELDS TABLE
-- =============================================
CREATE TABLE Fields (
    FieldId			INT NOT NULL IDENTITY(1,1),
    FieldName		NVARCHAR(100) NOT NULL,
    SizeAcres		DECIMAL(10,2) NOT NULL,
    SoilType		NVARCHAR(50) NULL,
    IrrigationType	NVARCHAR(30) NULL,
    FarmId			INT NOT NULL,
    IsActive		BIT NOT NULL DEFAULT 1,
    CreatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt		DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Primary Key Constraint
    CONSTRAINT PK_Fields PRIMARY KEY (FieldId),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_Fields_Farms FOREIGN KEY (FarmId) REFERENCES Farms(FarmId),
    
    -- Unique Constraints
    CONSTRAINT UQ_Fields_FieldName_Farm UNIQUE (FieldName, FarmId),
    
    -- Check Constraints
    CONSTRAINT CK_Fields_FieldName_NotEmpty CHECK (LEN(LTRIM(RTRIM(FieldName))) > 0)
);

-- =============================================
-- 5. SENSORS TABLE
-- =============================================
CREATE TABLE Sensors (
    SensorId			INT NOT NULL IDENTITY(1,1),
    SensorType			NVARCHAR(50) NOT NULL,
    Manufacturer		NVARCHAR(100) NULL,
    Model				NVARCHAR(100) NULL,
    SerialNumber		NVARCHAR(100) NULL,
    FieldId				INT NOT NULL,
    InstallationDate	DATETIME2 NULL,
    LastCalibrated		DATETIME2 NULL,
    CalibrationInterval INT NULL,
    LatestValue			DECIMAL(15,4) NULL,
    LatestUnit			NVARCHAR(20) NULL,
    LatestQualityScore	DECIMAL(3,2) NULL,
    LastReadingTime		DATETIME2 NULL,
    IsActive			BIT NOT NULL DEFAULT 1,
    CreatedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Primary Key Constraint
    CONSTRAINT PK_Sensors PRIMARY KEY (SensorId),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_Sensors_Fields FOREIGN KEY (FieldId) REFERENCES Fields(FieldId),
    
    -- Unique Constraints
    CONSTRAINT UQ_Sensors_SerialNumber UNIQUE (SerialNumber),
    
    -- Check Constraints
    CONSTRAINT CK_Sensors_SensorType_NotEmpty CHECK (LEN(LTRIM(RTRIM(SensorType))) > 0),
    CONSTRAINT CK_Sensors_SensorType_Valid CHECK (
        SensorType IN ('Temperature', 'Humidity', 'Soil_Moisture', 'pH', 'Light', 'Pressure', 'Wind', 'Rain')
    )
);

-- =============================================
-- 6. FIELDWISECROPS TABLE
-- =============================================
CREATE TABLE FieldWiseCrops (
    FieldWiseCropId		INT NOT NULL IDENTITY(1,1),
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
    
    -- Primary Key Constraint
    CONSTRAINT PK_FieldWiseCrops PRIMARY KEY (FieldWiseCropId),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_FieldWiseCrops_Fields FOREIGN KEY (FieldId) REFERENCES Fields(FieldId),
    CONSTRAINT FK_FieldWiseCrops_Crops FOREIGN KEY (CropId) REFERENCES Crops(CropId),
    
    -- Check Constraints
    CONSTRAINT CK_FieldWiseCrops_Status CHECK (Status IN ('Active', 'Harvested', 'Failed')),
);

-- =============================================
-- 7. RECOMMENDATIONS TABLE
-- =============================================
CREATE TABLE Recommendations (
    RecommendationId	INT NOT NULL IDENTITY(1,1),
    FieldId				INT NOT NULL,
    RecommendationType	NVARCHAR(50) NOT NULL,
    Title				NVARCHAR(200) NOT NULL,
    Description			NVARCHAR(MAX) NOT NULL,
    Priority			NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    EstimatedCost		DECIMAL(10,2) NULL,
    EstimatedBenefit	DECIMAL(10,2) NULL,
    ValidUntil			DATETIME2 NULL,
    GeneratedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Primary Key Constraint
    CONSTRAINT PK_Recommendations PRIMARY KEY (RecommendationId),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_Recommendations_Fields FOREIGN KEY (FieldId) REFERENCES Fields(FieldId),
    
    -- Check Constraints
    CONSTRAINT CK_Recommendations_Type_NotEmpty CHECK (LEN(LTRIM(RTRIM(RecommendationType))) > 0),
    CONSTRAINT CK_Recommendations_Title_NotEmpty CHECK (LEN(LTRIM(RTRIM(Title))) > 0),
    CONSTRAINT CK_Recommendations_Description_NotEmpty CHECK (LEN(LTRIM(RTRIM(Description))) > 0),
    CONSTRAINT CK_Recommendations_Priority CHECK (Priority IN ('High', 'Medium', 'Low'))
);

-- =============================================
-- 8. SCHEDULES TABLE
-- =============================================
CREATE TABLE Schedules (
    ScheduleId			INT NOT NULL IDENTITY(1,1),
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
    
    -- Primary Key Constraint
    CONSTRAINT PK_Schedules PRIMARY KEY (ScheduleId),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_Schedules_Fields FOREIGN KEY (FieldId) REFERENCES Fields(FieldId),
    CONSTRAINT FK_Schedules_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    
    -- Check Constraints
    CONSTRAINT CK_Schedules_Type_NotEmpty CHECK (LEN(LTRIM(RTRIM(ScheduleType))) > 0),
    CONSTRAINT CK_Schedules_Title_NotEmpty CHECK (LEN(LTRIM(RTRIM(Title))) > 0),
    CONSTRAINT CK_Schedules_Priority CHECK (Priority IN ('High', 'Medium', 'Low')),
    CONSTRAINT CK_Schedules_Status CHECK (Status IN ('Scheduled', 'InProgress', 'Completed', 'Cancelled'))
);

-- =============================================
-- 9. WEATHERDATA TABLE
-- =============================================
CREATE TABLE WeatherData (
    WeatherId			BIGINT NOT NULL IDENTITY(1,1),
    Location			NVARCHAR(255) NOT NULL,
    Latitude			DECIMAL(9,6) NOT NULL,
    Longitude			DECIMAL(9,6) NOT NULL,
    Temperature			DECIMAL(5,2) NULL,
    Humidity			DECIMAL(5,2) NULL,
    Pressure			DECIMAL(7,2) NULL,
    WindSpeed			DECIMAL(5,2) NULL,
    WeatherDescription	NVARCHAR(200) NULL,
    ForecastDate		DATETIME2 NOT NULL,
    DataType			NVARCHAR(20) NOT NULL,
    RetrievedAt			DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Primary Key Constraint
    CONSTRAINT PK_WeatherData PRIMARY KEY (WeatherId),
    
    -- Check Constraints
    CONSTRAINT CK_WeatherData_Location_NotEmpty CHECK (LEN(LTRIM(RTRIM(Location))) > 0),
    CONSTRAINT CK_WeatherData_Latitude CHECK (Latitude BETWEEN -90 AND 90),
    CONSTRAINT CK_WeatherData_Longitude CHECK (Longitude BETWEEN -180 AND 180),
    CONSTRAINT CK_WeatherData_Temperature CHECK (Temperature IS NULL OR Temperature BETWEEN -100 AND 70),
    CONSTRAINT CK_WeatherData_Humidity CHECK (Humidity IS NULL OR Humidity BETWEEN 0 AND 100),
    CONSTRAINT CK_WeatherData_Pressure CHECK (Pressure IS NULL OR Pressure BETWEEN 800 AND 1200),
    CONSTRAINT CK_WeatherData_WindSpeed CHECK (WindSpeed IS NULL OR WindSpeed >= 0),
    CONSTRAINT CK_WeatherData_DataType CHECK (DataType IN ('Current', 'Hourly', 'Daily'))
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

---- Users table indexes
--CREATE INDEX IX_Users_Email ON Users(Email);
--CREATE INDEX IX_Users_Role ON Users(Role);
--CREATE INDEX IX_Users_IsActive ON Users(IsActive);

---- Farms table indexes
--CREATE INDEX IX_Farms_UserId ON Farms(UserId);
--CREATE INDEX IX_Farms_Location ON Farms(Location);
--CREATE INDEX IX_Farms_Coordinates ON Farms(Latitude, Longitude);

---- Fields table indexes
--CREATE INDEX IX_Fields_FarmId ON Fields(FarmId);
--CREATE INDEX IX_Fields_SoilType ON Fields(SoilType);

---- Sensors table indexes
--CREATE INDEX IX_Sensors_FieldId ON Sensors(FieldId);
--CREATE INDEX IX_Sensors_SensorType ON Sensors(SensorType);
--CREATE INDEX IX_Sensors_IsActive ON Sensors(IsActive);
--CREATE INDEX IX_Sensors_LastReadingTime ON Sensors(LastReadingTime);

---- FieldWiseCrops table indexes
--CREATE INDEX IX_FieldWiseCrops_FieldId ON FieldWiseCrops(FieldId);
--CREATE INDEX IX_FieldWiseCrops_CropId ON FieldWiseCrops(CropId);
--CREATE INDEX IX_FieldWiseCrops_PlantedDate ON FieldWiseCrops(PlantedDate);
--CREATE INDEX IX_FieldWiseCrops_Status ON FieldWiseCrops(Status);

---- Recommendations table indexes
--CREATE INDEX IX_Recommendations_FieldId ON Recommendations(FieldId);
--CREATE INDEX IX_Recommendations_Priority ON Recommendations(Priority);
--CREATE INDEX IX_Recommendations_ValidUntil ON Recommendations(ValidUntil);

---- Schedules table indexes
--CREATE INDEX IX_Schedules_FieldId ON Schedules(FieldId);
--CREATE INDEX IX_Schedules_CreatedBy ON Schedules(CreatedBy);
--CREATE INDEX IX_Schedules_ScheduledDate ON Schedules(ScheduledDate);
--CREATE INDEX IX_Schedules_Status ON Schedules(Status);

---- WeatherData table indexes
--CREATE INDEX IX_WeatherData_Location_Date ON WeatherData(Location, ForecastDate);
--CREATE INDEX IX_WeatherData_Coordinates_Date ON WeatherData(Latitude, Longitude, ForecastDate);
--CREATE INDEX IX_WeatherData_DataType ON WeatherData(DataType);

---- SensorReadings table indexes
--CREATE INDEX IX_SensorReadings_SensorId_Time ON SensorReadings(SensorId, ReadingTime);
--CREATE INDEX IX_SensorReadings_ReadingTime ON SensorReadings(ReadingTime);

-- =============================================
-- SAMPLE DATA INSERTION (OPTIONAL)
-- =============================================

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

-- Insert Sample Sensors
INSERT INTO Sensors (SensorType, Manufacturer, Model, SerialNumber, FieldId, InstallationDate, LastCalibrated, CalibrationInterval, LatestValue, LatestUnit, LatestQualityScore, LastReadingTime) VALUES
('Temperature', 'AgriSense', 'T-101', 'SN-TEMP-001', 1, '2025-04-01', '2025-05-01', 30, 25.45, 'Celsius', 0.95, '2025-06-01'),
('Humidity', 'FarmTech', 'H-201', 'SN-HUM-002', 1, '2025-04-05', '2025-05-05', 60, 60.20, '%', 0.92, '2025-06-01'),
('Soil_Moisture', 'SoilPro', 'SM-301', 'SN-SM-003', 1, '2025-04-10', '2025-05-10', 45, 40.00, '%', 0.91, '2025-06-01'),
('pH', 'AgroLab', 'PH-151', 'SN-PH-004', 1, '2025-04-15', '2025-05-15', 90, 6.50, 'pH', 0.94, '2025-06-01'),
('Light', 'Photonics', 'LUX-801', 'SN-LUX-005', 1, '2025-04-20', '2025-05-20', 30, 14000, 'Lux', 0.90, '2025-06-01'),

('Temperature', 'AgriSense', 'T-102', 'SN-TEMP-006', 2, '2025-04-01', '2025-05-01', 30, 26.10, 'Celsius', 0.94, '2025-06-01'),
('Humidity', 'FarmTech', 'H-202', 'SN-HUM-007', 2, '2025-04-05', '2025-05-05', 60, 55.80, '%', 0.91, '2025-06-01'),
('Soil_Moisture', 'SoilPro', 'SM-302', 'SN-SM-008', 2, '2025-04-10', '2025-05-10', 45, 35.60, '%', 0.90, '2025-06-01'),
('pH', 'AgroLab', 'PH-152', 'SN-PH-009', 2, '2025-04-15', '2025-05-15', 90, 6.90, 'pH', 0.93, '2025-06-01'),
('Light', 'Photonics', 'LUX-802', 'SN-LUX-010', 2, '2025-04-20', '2025-05-20', 30, 13500, 'Lux', 0.89, '2025-06-01');

select * from Sensors;

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

-- Insert Sample Recommendations
INSERT INTO Recommendations (FieldId, RecommendationType, Title, Description, Priority, EstimatedCost, EstimatedBenefit, ValidUntil) VALUES
(1, 'Irrigation', 'Adjust Irrigation Schedule', 'Soil moisture levels are below optimal range. Increase watering frequency.', 'High', 500.00, 1500.00, '2025-07-31'),
(2, 'Fertilization', 'Apply Nitrogen Fertilizer', 'Crop leaves are showing nitrogen deficiency symptoms.', 'Medium', 300.00, 1000.00, '2025-07-25'),
(1, 'Pest Control', 'Use Organic Insecticide', 'Signs of aphid infestation detected on multiple crop rows.', 'High', 200.00, 800.00, '2025-07-20'),
(2, 'Soil Management', 'pH Correction Needed', 'Soil pH is too acidic for optimal crop growth. Apply lime.', 'Medium', 350.00, 900.00, '2025-08-15'),
(1, 'Harvesting', 'Schedule Early Harvest', 'Weather data suggests early rains. Harvest before peak.', 'High', 0.00, 1200.00, '2025-07-10'),
(2, 'Irrigation', 'Switch to Drip Irrigation', 'Water efficiency can be improved with drip irrigation system.', 'Low', 1000.00, 2500.00, '2025-09-01'),
(1, 'Fertilization', 'Apply Potassium Boost', 'Late-stage crop growth may benefit from additional potassium.', 'Medium', 400.00, 1100.00, '2025-08-01'),
(2, 'Crop Rotation', 'Plan for Rotation Next Cycle', 'Rotating to legumes will help soil nitrogen replenishment.', 'Low', 0.00, 500.00, '2025-12-31'),
(1, 'Pest Control', 'Deploy Pheromone Traps', 'Preventative pest control using eco-friendly traps.', 'Medium', 150.00, 600.00, '2025-07-30'),
(2, 'Weed Management', 'Manual Weeding Advised', 'Mild weed growth observed. Recommend hand weeding.', 'Low', 100.00, 300.00, '2025-07-20');

select * from Recommendations;

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
