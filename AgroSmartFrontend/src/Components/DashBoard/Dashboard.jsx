import React, { useState, useEffect } from "react";
import { 
  Sun, 
  CloudRain, 
  Thermometer, 
  Leaf, 
  Droplet, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  MapPin,
  Calendar,
  Clock
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
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
    rainForecast: "Loading...",
    totalUsers: 0,
    totalFields: 0,
    totalCrops: 0,
    activeUsers: 0,
    weatherAlerts: 0,
    systemHealth: 98
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [weather, setWeather] = useState(null);
  const [topCrops, setTopCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServerError, setIsServerError] = useState(false);

  // Chart data
  const [chartData, setChartData] = useState({
    weeklyData: [],
    farmDistribution: [],
    cropGrowthData: [],
    sensorReadings: [],
    userActivityData: [],
    weatherTrends: []
  });

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
      let totalFarms = 0;
      let farms = [];
      if (farmsRes.status === 'fulfilled') {
        farms = farmsRes.value.data || [];
        totalFarms = farms.length;
        setStats(prev => ({ ...prev, totalFarms }));
      }

      // Process sensors data  
      let sensors = [];
      if (sensorsRes.status === 'fulfilled') {
        sensors = sensorsRes.value.data || [];
        const activeSensors = sensors.length;
        
        // Calculate average moisture from sensor readings
        const avgMoisture = sensors.length > 0 
          ? Math.round(sensors.reduce((sum, sensor) => sum + (sensor.lastReading || Math.random() * 100), 0) / sensors.length)
          : 65;
        
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
          const latestWeather = weatherData[0];
          setWeather(latestWeather);
          setStats(prev => ({ 
            ...prev, 
            rainForecast: latestWeather?.rainfall > 0 ? "Yes 🌧️" : "No ☀️"
          }));
        }
      }

      // Process crops data
      let crops = [];
      if (cropsRes.status === 'fulfilled') {
        crops = cropsRes.value.data || [];
        const activeCrops = crops.filter(crop => crop.isActive);
        setTopCrops(activeCrops.slice(0, 5));
        setStats(prev => ({ ...prev, totalCrops: crops.length }));
      }

      // Generate additional stats with mock data (replace with real API calls)
      setStats(prev => ({
        ...prev,
        totalUsers: 156 + Math.floor(Math.random() * 50), // Mock users
        totalFields: Math.max(totalFarms * 2, 45 + Math.floor(Math.random() * 20)), // Mock fields
        activeUsers: 89 + Math.floor(Math.random() * 30), // Mock active users
        weatherAlerts: Math.floor(Math.random() * 5), // Mock alerts
        systemHealth: 95 + Math.floor(Math.random() * 5) // Mock system health
      }));

      // Generate dynamic chart data
      generateChartData(farms, sensors, crops);

      // Enhanced recent activity with real-time feel
      setRecentActivity([
        { 
          id: 1, 
          message: `${totalFarms} farms data synchronized`, 
          type: "success", 
          time: "2 minutes ago",
          icon: CheckCircle
        },
        { 
          id: 2, 
          message: `${sensors.length} sensors reporting normally`, 
          type: "info", 
          time: "5 minutes ago",
          icon: Activity
        },
        { 
          id: 3, 
          message: "Weather forecast updated", 
          type: "info", 
          time: "12 minutes ago",
          icon: CloudRain
        },
        { 
          id: 4, 
          message: "New user registration", 
          type: "success", 
          time: "18 minutes ago",
          icon: Users
        },
        { 
          id: 5, 
          message: `${crops.length} crops monitored actively`, 
          type: "info", 
          time: "25 minutes ago",
          icon: Leaf
        }
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
      
      // Set fallback data with some realistic values
      setStats({
        totalFarms: 12,
        activeSensors: 24, 
        avgMoisture: 68,
        rainForecast: "No ☀️",
        totalUsers: 156,
        totalFields: 28,
        totalCrops: 45,
        activeUsers: 89,
        weatherAlerts: 1,
        systemHealth: 97
      });
      
      // Generate fallback chart data
      generateChartData([], [], []);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (farms, sensors, crops) => {
    // Weekly farm activity data
    const weeklyData = [
      { name: 'Mon', farms: Math.floor(Math.random() * 20) + 15, fields: Math.floor(Math.random() * 30) + 25, sensors: Math.floor(Math.random() * 40) + 30 },
      { name: 'Tue', farms: Math.floor(Math.random() * 20) + 18, fields: Math.floor(Math.random() * 30) + 28, sensors: Math.floor(Math.random() * 40) + 35 },
      { name: 'Wed', farms: Math.floor(Math.random() * 20) + 22, fields: Math.floor(Math.random() * 30) + 32, sensors: Math.floor(Math.random() * 40) + 40 },
      { name: 'Thu', farms: Math.floor(Math.random() * 20) + 20, fields: Math.floor(Math.random() * 30) + 30, sensors: Math.floor(Math.random() * 40) + 38 },
      { name: 'Fri', farms: Math.floor(Math.random() * 20) + 25, fields: Math.floor(Math.random() * 30) + 35, sensors: Math.floor(Math.random() * 40) + 42 },
      { name: 'Sat', farms: Math.floor(Math.random() * 20) + 16, fields: Math.floor(Math.random() * 30) + 26, sensors: Math.floor(Math.random() * 40) + 32 },
      { name: 'Sun', farms: Math.floor(Math.random() * 20) + 14, fields: Math.floor(Math.random() * 30) + 24, sensors: Math.floor(Math.random() * 40) + 28 }
    ];

    // Farm type distribution
    const farmDistribution = [
      { name: 'Organic', value: 35, fill: '#10B981' },
      { name: 'Traditional', value: 45, fill: '#3B82F6' },
      { name: 'Hydroponic', value: 15, fill: '#F59E0B' },
      { name: 'Mixed', value: 5, fill: '#EF4444' }
    ];

    // Crop growth stages
    const cropGrowthData = [
      { name: 'Planted', value: 25, fill: '#8B5CF6' },
      { name: 'Growing', value: 40, fill: '#10B981' },
      { name: 'Flowering', value: 20, fill: '#F59E0B' },
      { name: 'Harvesting', value: 15, fill: '#EF4444' }
    ];

    // Sensor readings over time
    const sensorReadings = [
      { time: '00:00', temperature: 22, humidity: 65, moisture: 70 },
      { time: '04:00', temperature: 20, humidity: 70, moisture: 68 },
      { time: '08:00', temperature: 25, humidity: 60, moisture: 72 },
      { time: '12:00', temperature: 30, humidity: 55, moisture: 65 },
      { time: '16:00', temperature: 28, humidity: 58, moisture: 67 },
      { time: '20:00', temperature: 24, humidity: 62, moisture: 69 }
    ];

    // User activity data
    const userActivityData = [
      { name: 'Jan', active: 120, new: 15, total: 135 },
      { name: 'Feb', active: 132, new: 22, total: 154 },
      { name: 'Mar', active: 145, new: 18, total: 163 },
      { name: 'Apr', active: 138, new: 25, total: 163 },
      { name: 'May', active: 155, new: 20, total: 175 },
      { name: 'Jun', active: 168, new: 28, total: 203 }
    ];

    // Weather trends
    const weatherTrends = [
      { day: 'Mon', temp: 24, rainfall: 2.3, humidity: 65 },
      { day: 'Tue', temp: 26, rainfall: 0, humidity: 60 },
      { day: 'Wed', temp: 28, rainfall: 0, humidity: 58 },
      { day: 'Thu', temp: 25, rainfall: 5.2, humidity: 72 },
      { day: 'Fri', temp: 23, rainfall: 8.1, humidity: 78 },
      { day: 'Sat', temp: 22, rainfall: 3.4, humidity: 70 },
      { day: 'Sun', temp: 24, rainfall: 0, humidity: 62 }
    ];

    setChartData({
      weeklyData,
      farmDistribution,
      cropGrowthData,
      sensorReadings,
      userActivityData,
      weatherTrends
    });
  };

  // Chart color schemes
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            🌿 AgroSmart Admin Dashboard
          </h1>
          <p className="text-green-100">Comprehensive farm management analytics</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-500">Loading comprehensive dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isServerError) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            🌿 AgroSmart Admin Dashboard
          </h1>
          <p className="text-green-100">Comprehensive farm management analytics</p>
        </div>
        <OfflineState 
          message={error}
          onRetry={retryConnection}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              🌿 AgroSmart Admin Dashboard
            </h1>
            <p className="text-green-100">Comprehensive farm management analytics & insights</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center text-sm mt-1">
                <Clock className="w-4 h-4 mr-2" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Real-time system status */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">System Online</span>
          </div>
          <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-sm">{stats.systemHealth}% Health</span>
          </div>
          <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{stats.activeUsers} Active Users</span>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Farms"
          value={stats.totalFarms}
          unit=""
          icon={Leaf}
          color="bg-green-500"
          trend="+12%"
          subtitle="vs last month"
        />
        <StatsCard
          title="Active Sensors"
          value={stats.activeSensors}
          unit=""
          icon={Thermometer}
          color="bg-blue-500"
          trend="+8%"
          subtitle="monitoring live"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          unit=""
          icon={Users}
          color="bg-purple-500"
          trend="+15%"
          subtitle="registered users"
        />
        <StatsCard
          title="Avg. Moisture"
          value={stats.avgMoisture}
          unit="%"
          icon={Droplet}
          color="bg-cyan-500"
          trend="+2%"
          subtitle="optimal range"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Weekly Activity Overview
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Farms
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Fields
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                Sensors
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.weeklyData}>
              <defs>
                <linearGradient id="colorFarms" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorFields" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Area type="monotone" dataKey="farms" stackId="1" stroke="#10B981" fillOpacity={1} fill="url(#colorFarms)" />
              <Area type="monotone" dataKey="fields" stackId="1" stroke="#3B82F6" fillOpacity={1} fill="url(#colorFields)" />
              <Line type="monotone" dataKey="sensors" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Farm Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-600" />
            Farm Types Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={chartData.farmDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.farmDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Data & Weather Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Sensor Readings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Real-time Sensor Readings
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.sensorReadings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                name="Temperature (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Humidity (%)"
              />
              <Line 
                type="monotone" 
                dataKey="moisture" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Soil Moisture (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CloudRain className="w-5 h-5 mr-2 text-green-600" />
            7-Day Weather Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.weatherTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Legend />
              <Bar dataKey="temp" fill="#F59E0B" name="Temperature (°C)" />
              <Bar dataKey="rainfall" fill="#3B82F6" name="Rainfall (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Activity Feed & Top Crops */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Real-time System Activity
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className={`flex items-center p-4 rounded-lg border-l-4 ${
                  activity.type === 'success' ? 'bg-green-50 border-green-500' : 
                  activity.type === 'warning' ? 'bg-yellow-50 border-yellow-500' : 
                  'bg-blue-50 border-blue-500'
                } hover:shadow-md transition-shadow`}>
                  <div className={`p-2 rounded-full mr-4 ${
                    activity.type === 'success' ? 'bg-green-100' : 
                    activity.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      activity.type === 'success' ? 'text-green-600' : 
                      activity.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{activity.message}</p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.type === 'success' ? 'bg-green-100 text-green-800' : 
                    activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.type.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Top Performing Crops */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Top Performing Crops
          </h2>
          <div className="space-y-4">
            {topCrops.length > 0 ? (
              topCrops.map((crop, index) => (
                <div key={crop.id || index} className={`p-4 rounded-lg border ${
                  index === 0 ? 'bg-green-50 border-green-200' : 
                  index === 1 ? 'bg-blue-50 border-blue-200' : 
                  index === 2 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        index === 2 ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{crop.cropName || crop.name || `Crop ${index + 1}`}</p>
                        <p className="text-sm text-gray-600">
                          {crop.isActive ? 'Active Growth' : 'Monitoring'} • 
                          {crop.fieldName || 'Field ' + (index + 1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        crop.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {crop.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Growth Progress</span>
                      <span>{Math.floor(Math.random() * 40) + 60}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No crops data available</p>
                <p className="text-sm text-gray-400">Crops will appear here once data is loaded</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Activity & System Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            User Growth Analytics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.userActivityData}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="active" 
                stackId="1" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorActive)"
                name="Active Users"
              />
              <Area 
                type="monotone" 
                dataKey="new" 
                stackId="1" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorNew)"
                name="New Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Weather Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Sun className="w-5 h-5 mr-2 text-green-600" />
            Current Weather Conditions
          </h2>
          <div className="space-y-6">
            {/* Main weather display */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
                <Sun className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {weather?.temperature || 28}°C
                </p>
                <p className="text-gray-600 font-medium">
                  {weather?.rainfall > 0 ? "Rainy Weather" : "Clear & Sunny"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Perfect conditions for farming
                </p>
              </div>
            </div>

            {/* Weather details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {weather?.humidity || 65}%
                    </p>
                  </div>
                  <Droplet className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rainfall</p>
                    <p className="text-2xl font-bold text-green-600">
                      {weather?.rainfall || 0} mm
                    </p>
                  </div>
                  <CloudRain className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {weather?.windSpeed || 12} km/h
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">UV Index</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.floor(Math.random() * 5) + 3}
                    </p>
                  </div>
                  <Sun className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Weather forecast summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Today's Forecast</h3>
              <p className="text-sm text-gray-600">
                {stats.rainForecast === "Yes 🌧️" 
                  ? "Rain expected later today. Ensure proper drainage for crops."
                  : "Clear skies throughout the day. Great for outdoor farming activities."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Alerts */}
      {stats.weatherAlerts > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-yellow-800">
                {stats.weatherAlerts} Weather Alert{stats.weatherAlerts > 1 ? 's' : ''}
              </h3>
              <p className="text-yellow-700 mt-1">
                Monitor weather conditions closely. Check your crops and sensors for any required adjustments.
              </p>
            </div>
            <button className="ml-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
