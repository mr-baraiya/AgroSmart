import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Cloud, MapPin, Thermometer, Droplets, Wind, Calendar, RefreshCw, Satellite, Navigation } from "lucide-react";
import { weatherService, realTimeWeatherService, farmService } from "../../services";

const WeatherFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    temperature: "",
    humidity: "",
    pressure: "",
    windSpeed: "",
    weatherDescription: "",
    forecastDate: "",
    dataType: "current"
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingRealTime, setFetchingRealTime] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [showRealTimeSection, setShowRealTimeSection] = useState(false);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [loadingFarms, setLoadingFarms] = useState(false);

  // Weather description options
  const weatherDescriptions = [
    "Sunny", "Partly Cloudy", "Cloudy", "Overcast", "Light Rain", "Heavy Rain",
    "Thunderstorm", "Snow", "Light Snow", "Heavy Snow", "Fog", "Windy", "Clear"
  ];

  // Data type options
  const dataTypes = [
    { value: "current", label: "Current Weather" },
    { value: "forecast", label: "Weather Forecast" },
    { value: "historical", label: "Historical Data" }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchWeatherData();
    } else {
      // Set default forecast date to current time for new records
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        forecastDate: now.toISOString().slice(0, 16) // Format for datetime-local input
      }));
    }
    // Load farms for selection
    loadFarms();
  }, [id, isEdit]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await weatherService.getById(id);
      const weather = response.data;
      
      setFormData({
        location: weather.location || "",
        latitude: weather.latitude || "",
        longitude: weather.longitude || "",
        temperature: weather.temperature || "",
        humidity: weather.humidity || "",
        pressure: weather.pressure || "",
        windSpeed: weather.windSpeed || "",
        weatherDescription: weather.weatherDescription || "",
        forecastDate: weather.forecastDate ? 
          new Date(weather.forecastDate).toISOString().slice(0, 16) : "",
        dataType: weather.dataType || "current"
      });
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const weatherData = {
        ...formData,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        temperature: parseFloat(formData.temperature) || 0,
        humidity: parseFloat(formData.humidity) || 0,
        pressure: parseFloat(formData.pressure) || 0,
        windSpeed: parseFloat(formData.windSpeed) || 0,
        forecastDate: new Date(formData.forecastDate).toISOString(),
        retrievedAt: new Date().toISOString()
      };

      if (isEdit) {
        await weatherService.update(id, weatherData);
        navigate("/weather", {
          state: {
            message: `Weather data for "${formData.location}" updated successfully!`,
            type: "success"
          }
        });
      } else {
        await weatherService.create(weatherData);
        navigate("/weather", {
          state: {
            message: `Weather data for "${formData.location}" created successfully!`,
            type: "success"
          }
        });
      }
    } catch (err) {
      console.error("Error saving weather data:", err);
      setError(`Failed to ${isEdit ? 'update' : 'create'} weather data`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/weather");
  };

  // Real-time weather fetching functions
  const fetchCurrentWeatherByLocation = async () => {
    if (!locationInput.trim()) {
      setError("Please enter a location name");
      return;
    }

    setFetchingRealTime(true);
    setError(null);

    try {
      const weatherData = await realTimeWeatherService.getCurrentWeatherByCity(locationInput);
      const convertedData = realTimeWeatherService.convertToAppFormat(weatherData);
      
      setFormData(prev => ({
        ...prev,
        ...convertedData,
        forecastDate: new Date().toISOString().slice(0, 16)
      }));
      
      setShowRealTimeSection(false);
      setLocationInput("");
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data. Please check the location name and try again.");
    } finally {
      setFetchingRealTime(false);
    }
  };

  const fetchCurrentWeatherByCoords = async () => {
    if (!formData.latitude || !formData.longitude) {
      setError("Please enter latitude and longitude coordinates");
      return;
    }

    setFetchingRealTime(true);
    setError(null);

    try {
      const weatherData = await realTimeWeatherService.getCurrentWeatherByCoords(
        parseFloat(formData.latitude),
        parseFloat(formData.longitude)
      );
      const convertedData = realTimeWeatherService.convertToAppFormat(weatherData);
      
      setFormData(prev => ({
        ...prev,
        ...convertedData,
        forecastDate: new Date().toISOString().slice(0, 16)
      }));
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data. Please check the coordinates and try again.");
    } finally {
      setFetchingRealTime(false);
    }
  };

  const fetchWeatherByCurrentLocation = async () => {
    setFetchingRealTime(true);
    setError(null);

    try {
      const position = await realTimeWeatherService.getCurrentLocation();
      const weatherData = await realTimeWeatherService.getCurrentWeatherByCoords(
        position.latitude,
        position.longitude
      );
      const convertedData = realTimeWeatherService.convertToAppFormat(weatherData);
      
      setFormData(prev => ({
        ...prev,
        ...convertedData,
        forecastDate: new Date().toISOString().slice(0, 16)
      }));
      
      setShowRealTimeSection(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      if (err.message.includes('Geolocation')) {
        setError("Geolocation is not supported or permission denied. Please enter coordinates manually.");
      } else {
        setError("Failed to fetch weather data for your current location.");
      }
    } finally {
      setFetchingRealTime(false);
    }
  };

  // Load all farms for selection
  const loadFarms = async () => {
    setLoadingFarms(true);
    try {
      const response = await farmService.getAll();
      setFarms(response.data || []);
    } catch (err) {
      console.error("Error loading farms:", err);
      setError("Failed to load farms");
    } finally {
      setLoadingFarms(false);
    }
  };

  // Fetch weather for selected farm
  const fetchWeatherForFarm = async () => {
    if (!selectedFarmId) {
      setError("Please select a farm first");
      return;
    }

    const selectedFarm = farms.find(farm => farm.farmId.toString() === selectedFarmId);
    if (!selectedFarm) {
      setError("Selected farm not found");
      return;
    }

    if (!selectedFarm.latitude || !selectedFarm.longitude) {
      setError("Selected farm doesn't have coordinates. Please update farm location first.");
      return;
    }

    setFetchingRealTime(true);
    setError(null);

    try {
      const weatherData = await realTimeWeatherService.getCurrentWeatherByCoords(
        parseFloat(selectedFarm.latitude),
        parseFloat(selectedFarm.longitude)
      );
      const convertedData = realTimeWeatherService.convertToAppFormat(weatherData);
      
      // Set the location to farm name + API location
      convertedData.location = `${selectedFarm.farmName} (${convertedData.location})`;
      
      setFormData(prev => ({
        ...prev,
        ...convertedData,
        forecastDate: new Date().toISOString().slice(0, 16)
      }));
      
      setShowRealTimeSection(false);
      setSelectedFarmId("");
    } catch (err) {
      console.error("Error fetching weather data for farm:", err);
      setError(`Failed to fetch weather data for ${selectedFarm.farmName}. Please try again.`);
    } finally {
      setFetchingRealTime(false);
    }
  };

  // Fetch weather for all farms
  const fetchWeatherForAllFarms = async () => {
    if (farms.length === 0) {
      setError("No farms available to fetch weather for");
      return;
    }

    const farmsWithCoordinates = farms.filter(farm => farm.latitude && farm.longitude);
    if (farmsWithCoordinates.length === 0) {
      setError("No farms have coordinates set. Please update farm locations first.");
      return;
    }

    setFetchingRealTime(true);
    setError(null);

    try {
      const weatherPromises = farmsWithCoordinates.map(async (farm) => {
        try {
          const weatherData = await realTimeWeatherService.getCurrentWeatherByCoords(
            parseFloat(farm.latitude),
            parseFloat(farm.longitude)
          );
          const convertedData = realTimeWeatherService.convertToAppFormat(weatherData);
          
          // Create weather record for this farm
          const weatherRecord = {
            ...convertedData,
            location: `${farm.farmName} (${convertedData.location})`,
            forecastDate: new Date().toISOString(),
            retrievedAt: new Date().toISOString()
          };

          // Save to database
          await weatherService.create(weatherRecord);
          return { success: true, farm: farm.farmName };
        } catch (err) {
          console.error(`Error fetching weather for ${farm.farmName}:`, err);
          return { success: false, farm: farm.farmName, error: err.message };
        }
      });

      const results = await Promise.all(weatherPromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        navigate("/weather", {
          state: {
            message: `✅ Weather data fetched for ${successful.length} farms successfully!${failed.length > 0 ? ` (${failed.length} failed)` : ''}`,
            type: "success"
          }
        });
      } else {
        setError("Failed to fetch weather data for any farms");
      }
    } catch (err) {
      console.error("Error in bulk weather fetch:", err);
      setError("Failed to fetch weather data for farms");
    } finally {
      setFetchingRealTime(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-600"></div>
            <span className="text-sky-600 font-medium">Loading weather data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="p-3 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <Cloud className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-800 to-blue-600 bg-clip-text text-transparent">
            {isEdit ? 'Edit Weather Data' : 'Add Weather Data'}
          </h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-800 rounded-xl">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200 overflow-hidden">
        <div className="p-8">
          {/* Quick Real-time Weather Button */}
          {!isEdit && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-800">Quick Start with Real-time Data</h4>
                  <p className="text-sm text-green-600">Fetch current weather for your farms or enter manually</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRealTimeSection(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <Satellite className="w-4 h-4" />
                  Fetch Farm Weather
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Row 1: Location Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-sky-800 flex items-center gap-2 border-b border-sky-200 pb-2">
                <MapPin className="w-5 h-5" />
                Location Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., New York, NY"
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="0.000001"
                    min="-90"
                    max="90"
                    placeholder="e.g., 40.7128"
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="0.000001"
                    min="-180"
                    max="180"
                    placeholder="e.g., -74.0060"
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Real-time Weather Section */}
            <div className="space-y-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  Fetch Real-time Weather Data
                </h3>
                <button
                  type="button"
                  onClick={() => setShowRealTimeSection(!showRealTimeSection)}
                  className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  {showRealTimeSection ? 'Hide Options' : 'Show Options'}
                </button>
              </div>

              {showRealTimeSection && (
                <div className="space-y-6">
                  <p className="text-sm text-green-700">
                    Use real-time weather data from OpenWeatherMap API to automatically fill the weather information.
                  </p>
                  
                  {/* Farm-based Weather Section */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Fetch Weather for Farms
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Single Farm Selection */}
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-emerald-700 mb-1">
                            Select Farm
                          </label>
                          <select
                            value={selectedFarmId}
                            onChange={(e) => setSelectedFarmId(e.target.value)}
                            disabled={fetchingRealTime || loadingFarms}
                            className="w-full p-2 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-200 text-sm"
                          >
                            <option value="">
                              {loadingFarms ? "Loading farms..." : "Choose a farm"}
                            </option>
                            {farms.map((farm) => (
                              <option key={farm.farmId} value={farm.farmId}>
                                {farm.farmName} {farm.latitude && farm.longitude ? '✓' : '⚠️ No coordinates'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={fetchWeatherForFarm}
                          disabled={fetchingRealTime || !selectedFarmId}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          {fetchingRealTime ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Cloud className="w-4 h-4" />
                          )}
                          Fetch for Farm
                        </button>
                      </div>

                      {/* Bulk Weather Fetch */}
                      <div className="pt-3 border-t border-emerald-200">
                        <button
                          type="button"
                          onClick={fetchWeatherForAllFarms}
                          disabled={fetchingRealTime || farms.length === 0}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
                        >
                          {fetchingRealTime ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Fetching for all farms...
                            </>
                          ) : (
                            <>
                              <Satellite className="w-4 h-4" />
                              Fetch Weather for All Farms
                            </>
                          )}
                        </button>
                        <p className="text-xs text-emerald-600 mt-1">
                          This will create weather records for all farms with coordinates
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manual Options */}
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Manual Weather Fetch</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Fetch by Current Location */}
                      <button
                        type="button"
                        onClick={fetchWeatherByCurrentLocation}
                        disabled={fetchingRealTime}
                        className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-all duration-200 font-medium text-sm"
                      >
                        {fetchingRealTime ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4" />
                        )}
                        Use Current Location
                      </button>

                      {/* Fetch by Coordinates */}
                      <button
                        type="button"
                        onClick={fetchCurrentWeatherByCoords}
                        disabled={fetchingRealTime || !formData.latitude || !formData.longitude}
                        className="flex items-center justify-center gap-2 p-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-all duration-200 font-medium text-sm"
                      >
                        {fetchingRealTime ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        Use Coordinates
                      </button>

                      {/* Fetch by City Name */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          placeholder="Enter city name"
                          disabled={fetchingRealTime}
                          className="flex-1 p-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 text-sm"
                        />
                        <button
                          type="button"
                          onClick={fetchCurrentWeatherByLocation}
                          disabled={fetchingRealTime || !locationInput.trim()}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          {fetchingRealTime ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Cloud className="w-3 h-3" />
                          )}
                          Fetch
                        </button>
                      </div>
                    </div>
                  </div>

                  {fetchingRealTime && (
                    <div className="flex items-center justify-center gap-2 p-4 bg-white/50 rounded-lg">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-blue-700 font-medium">Fetching real-time weather data...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Row 2: Weather Conditions */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-sky-800 flex items-center gap-2 border-b border-sky-200 pb-2">
                <Thermometer className="w-5 h-5" />
                Weather Conditions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Temperature (°C) *
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                    step="0.1"
                    placeholder="e.g., 25.5"
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700 flex items-center gap-1">
                    <Droplets className="w-4 h-4" />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g., 65"
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Pressure (hPa)
                  </label>
                  <input
                    type="number"
                    name="pressure"
                    value={formData.pressure}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 1013.25"
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700 flex items-center gap-1">
                    <Wind className="w-4 h-4" />
                    Wind Speed (km/h)
                  </label>
                  <input
                    type="number"
                    name="windSpeed"
                    value={formData.windSpeed}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 15.5"
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Description and Timing */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-sky-800 flex items-center gap-2 border-b border-sky-200 pb-2">
                <Calendar className="w-5 h-5" />
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Weather Description
                  </label>
                  <select
                    name="weatherDescription"
                    value={formData.weatherDescription}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  >
                    <option value="">Select condition</option>
                    {weatherDescriptions.map(desc => (
                      <option key={desc} value={desc}>
                        {desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Data Type *
                  </label>
                  <select
                    name="dataType"
                    value={formData.dataType}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  >
                    {dataTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-sky-700">
                    Forecast Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="forecastDate"
                    value={formData.forecastDate}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-sky-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : (isEdit ? 'Update Weather Data' : 'Create Weather Data')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WeatherFormPage;
