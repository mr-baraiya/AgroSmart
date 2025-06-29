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
    CONSTRAINT CK_FieldWiseCrops_GrowthStage CHECK (
        CurrentGrowthStage IS NULL OR 
        CurrentGrowthStage IN ('Germination', 'Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity')
    )
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
('Admin User', 'admin@example.com', 'hashed_password_789', 'Admin', '1122334455', '789 Admin Street');

-- Insert sample crops
INSERT INTO Crops (CropName, OptimalSoilpHMin, OptimalSoilpHMax, OptimalTempMin, OptimalTempMax, AvgWaterReqmm, GrowthDurationDays, SeedingDepthCm, HarvestSeason, Description) VALUES
('Wheat', 6.0, 7.5, 15.0, 25.0, 450.0, 120, 2.5, 'Summer', 'Common wheat crop'),
('Corn', 5.8, 6.8, 20.0, 30.0, 600.0, 90, 3.0, 'Fall', 'Maize crop'),
('Tomato', 6.0, 6.8, 18.0, 27.0, 400.0, 75, 1.0, 'Summer', 'Tomato vegetable crop');

PRINT 'AgroSmart database schema created successfully with all constraints!';