import React, { useState, useEffect } from "react";
import { Sun, CloudRain, Thermometer, Leaf, Droplet } from "lucide-react";
import { farmService, sensorService, weatherService, cropService } from "../../services";
import { useServerStatusContext } from "../../contexts/ServerStatusProvider";
import OfflineState from "../common/OfflineState";
import StatsCard from "./StatsCard";

const Dashboard = () => {
  const { isServerOnline, isInitialCheck, handleApiError, retryConnection } = useServerStatusContext();
  
  const [stats, setStats] = useState({
    totalFarms: 0,
    activeSensors: 0,
    avgMoisture: 0,
    rainForecast: "Loading..."
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [weather, setWeather] = useState(null);
  const [topCrops, setTopCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);

  useEffect(() => {
    // Only fetch dashboard data after initial server status check is complete
    if (!isInitialCheck) {
      console.log('🚀 Initial server check complete, fetching dashboard data...');
      fetchDashboardData();
    }
  }, [isInitialCheck]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics using API services
      const [farmsRes, sensorsRes, weatherRes, cropsRes] = await Promise.allSettled([
        farmService.getAll(),
        sensorService.getAll(), 
        weatherService.getAll(),
        cropService.getAll()
      ]);

      // Process farms data
      if (farmsRes.status === 'fulfilled') {
        setStats(prev => ({ ...prev, totalFarms: farmsRes.value.data.length || 0 }));
      }

      // Process sensors data  
      if (sensorsRes.status === 'fulfilled') {
        const sensors = sensorsRes.value.data || [];
        const activeSensors = sensors.length; // Assuming all returned sensors are active
        
        // Calculate average moisture from sensor readings
        const avgMoisture = sensors.length > 0 
          ? Math.round(sensors.reduce((sum, sensor) => sum + (sensor.lastReading || 0), 0) / sensors.length)
          : 0;
        
        setStats(prev => ({ 
          ...prev, 
          activeSensors,
          avgMoisture 
        }));
      }

      // Process weather data
      if (weatherRes.status === 'fulfilled') {
        const weatherData = weatherRes.value.data;
        if (weatherData && weatherData.length > 0) {
          const latestWeather = weatherData[0]; // Get most recent weather data
          setWeather(latestWeather);
          setStats(prev => ({ 
            ...prev, 
            rainForecast: latestWeather?.rainfall > 0 ? "Yes 🌧️" : "No ☀️"
          }));
        }
      }

      // Process crops data for top performing
      if (cropsRes.status === 'fulfilled') {
        const crops = cropsRes.value.data || [];
        const activeCrops = crops.filter(crop => crop.isActive);
        setTopCrops(activeCrops.slice(0, 3)); // Top 3 crops
      }

      // Mock recent activity (replace with real API when available)
      setRecentActivity([
        { id: 1, message: "Farm data updated", type: "success", time: "2 hours ago" },
        { id: 2, message: "Sensor maintenance completed", type: "info", time: "4 hours ago" },
        { id: 3, message: "Weather forecast updated", type: "info", time: "6 hours ago" }
      ]);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      const apiResponse = handleApiError(error);
      if (apiResponse.isServerDown) {
        setIsServerError(true);
        setError('Backend server is currently offline. Dashboard data may not be current.');
      } else {
        setError(apiResponse.message);
      }
      // Set fallback data on error
      setStats({
        totalFarms: 0,
        activeSensors: 0, 
        avgMoisture: 0,
        rainForecast: "N/A"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-green-800">
          Welcome to AgroSmart Dashboard 🌿
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (isServerError) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-green-800">
          Welcome to AgroSmart Dashboard 🌿
        </h1>
        <OfflineState 
          message={error}
          onRetry={retryConnection}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-800">
        Welcome to AgroSmart Dashboard 🌿
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Farms"
          value={stats.totalFarms}
          unit=""
          icon={Leaf}
          color="bg-green-500"
          trend="5"
        />
        <StatsCard
          title="Active Sensors"
          value={stats.activeSensors}
          unit=""
          icon={Thermometer}
          color="bg-yellow-500"
          trend="8"
        />
        <StatsCard
          title="Avg. Moisture"
          value={stats.avgMoisture}
          unit="%"
          icon={Droplet}
          color="bg-blue-500"
          trend="2"
        />
        <StatsCard
          title="Rain Forecast"
          value={stats.rainForecast}
          unit=""
          icon={CloudRain}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className={`flex items-center p-3 rounded-lg ${
              activity.type === 'success' ? 'bg-green-50' : 
              activity.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-3 ${
                activity.type === 'success' ? 'bg-green-500' : 
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <span className="text-gray-700">{activity.message}</span>
              <span className="text-gray-500 text-sm ml-auto">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Weather</h2>
          <div className="flex items-center space-x-4">
            <Sun className="w-12 h-12 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">
                {weather ? `${weather.temperature}°C` : "28°C"}
              </p>
              <p className="text-gray-600">
                {weather ? (weather.rainfall > 0 ? "Rainy" : "Clear Sky") : "Sunny, Clear Sky"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="font-semibold">
                {weather ? `${weather.humidity}%` : "65%"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Rainfall</p>
              <p className="font-semibold">
                {weather ? `${weather.rainfall} mm` : "0 mm"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="font-semibold">
                {weather ? `${weather.windSpeed} km/h` : "12 km/h"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top Performing Crops</h2>
          <div className="space-y-3">
            {topCrops.length > 0 ? (
              topCrops.map((crop, index) => (
                <div key={crop.id || index} className={`flex justify-between items-center p-3 rounded-lg ${
                  index === 0 ? 'bg-green-50' : index === 1 ? 'bg-green-50' : 'bg-yellow-50'
                }`}>
                  <span className="font-medium">{crop.cropName}</span>
                  <span className={`font-semibold ${
                    index === 0 ? 'text-green-600' : index === 1 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {crop.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))
            ) : (
              // Fallback data when no crops available
              <>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">No crops available</span>
                  <span className="text-gray-600 font-semibold">-</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
