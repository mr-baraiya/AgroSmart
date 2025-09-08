import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  BarChart3, 
  Wheat, 
  Plus,
  TrendingUp,
  Calendar,
  Cloud,
  Bell,
  Activity,
  Droplets,
  Thermometer,
  Sun,
  Target,
  Award,
  Zap,
  PieChart,
  LineChart
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
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
import { farmService } from '../../../services/farmService';
import { fieldService } from '../../../services/fieldService';
import { cropService } from '../../../services/cropService';
import { useAuth } from '../../../contexts/AuthProvider';
import { useServerStatusContext } from '../../../contexts/ServerStatusProvider';

const UserDashboard = () => {
  const { user } = useAuth();
  const { isServerOnline, isInitialCheck, handleApiError } = useServerStatusContext();
  const [dashboardData, setDashboardData] = useState({
    farms: [],
    fields: [],
    crops: [],
    stats: {
      totalFarms: 0,
      totalFields: 0,
      totalCrops: 0,
      totalArea: 0,
      activeCrops: 0,
      readyToHarvest: 0,
      monthlyGrowth: 0,
      efficiency: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [weather] = useState({
    temperature: 24,
    humidity: 65,
    condition: 'Partly Cloudy',
    forecast: 'Good farming conditions',
    uvIndex: 6,
    windSpeed: 8
  });

  // Chart data for enhanced analytics
  const [chartData, setChartData] = useState({
    cropPerformance: [],
    farmProductivity: [],
    monthlyActivity: [],
    weatherTrends: [],
    resourceUtilization: []
  });

  useEffect(() => {
    // Only fetch dashboard data after initial server status check is complete
    if (!isInitialCheck && isServerOnline) {
      fetchDashboardData();
    } else if (!isInitialCheck && !isServerOnline) {
      // Set empty data if server is offline
      setDashboardData({
        farms: [],
        fields: [],
        crops: [],
        stats: {
          totalFarms: 0,
          totalFields: 0,
          totalCrops: 0,
          totalArea: 0,
          activeCrops: 0,
          readyToHarvest: 0
        }
      });
      setLoading(false);
    }
  }, [isInitialCheck, isServerOnline]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [farmsResponse, fieldsResponse, cropsResponse] = await Promise.allSettled([
        farmService.getAll(),
        fieldService.getAll(),
        cropService.getAll()
      ]);

      // Process data from settled promises
      const allFarms = farmsResponse.status === 'fulfilled' ? (farmsResponse.value.data || []) : [];
      const allFields = fieldsResponse.status === 'fulfilled' ? (fieldsResponse.value.data || []) : [];
      const allCrops = cropsResponse.status === 'fulfilled' ? (cropsResponse.value.data || []) : [];
      
      // If backend doesn't filter by user, we'll show all data for now
      // You can add filtering here later when backend supports it
      const farms = allFarms;
      const fields = allFields;
      const crops = allCrops;

      const stats = {
        totalFarms: farms.length,
        totalFields: fields.length,
        totalCrops: crops.length,
        totalArea: farms.reduce((sum, farm) => sum + parseFloat(farm.area || 0), 0),
        activeCrops: crops.filter(crop => ['planted', 'growing'].includes(crop.status)).length,
        readyToHarvest: crops.filter(crop => crop.status === 'harvesting').length,
        monthlyGrowth: Math.floor(Math.random() * 20) + 10, // Mock growth percentage
        efficiency: Math.floor(Math.random() * 15) + 85 // Mock efficiency score
      };

      setDashboardData({
        farms: farms.slice(0, 3), // Show only first 3
        fields: fields.slice(0, 3),
        crops: crops.slice(0, 3),
        stats
      });

      // Generate chart data
      generateChartData(farms, fields, crops);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      handleApiError(error); // Use server status context error handler
      // Set empty data instead of crashing
      setDashboardData({
        farms: [],
        fields: [],
        crops: [],
        stats: {
          totalFarms: 0,
          totalFields: 0,
          totalCrops: 0,
          totalArea: 0,
          activeCrops: 0,
          readyToHarvest: 0,
          monthlyGrowth: 0,
          efficiency: 0
        }
      });
      // Generate fallback chart data
      generateChartData([], [], []);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (farms, fields, crops) => {
    // Crop performance data
    const cropPerformance = [
      { name: 'Wheat', yield: 85, health: 92, growth: 78 },
      { name: 'Corn', yield: 78, health: 88, growth: 82 },
      { name: 'Rice', yield: 90, health: 85, growth: 75 },
      { name: 'Tomato', yield: 88, health: 90, growth: 85 },
      { name: 'Potato', yield: 82, health: 87, growth: 80 }
    ];

    // Farm productivity over months
    const farmProductivity = [
      { month: 'Jan', production: 65, efficiency: 78, cost: 45 },
      { month: 'Feb', production: 70, efficiency: 82, cost: 42 },
      { month: 'Mar', production: 75, efficiency: 85, cost: 38 },
      { month: 'Apr', production: 80, efficiency: 88, cost: 35 },
      { month: 'May', production: 85, efficiency: 90, cost: 32 },
      { month: 'Jun', production: 88, efficiency: 92, cost: 30 }
    ];

    // Monthly activity data
    const monthlyActivity = [
      { name: 'Planting', value: 30, fill: '#10B981' },
      { name: 'Monitoring', value: 40, fill: '#3B82F6' },
      { name: 'Harvesting', value: 20, fill: '#F59E0B' },
      { name: 'Planning', value: 10, fill: '#8B5CF6' }
    ];

    // Weather trends
    const weatherTrends = [
      { day: 'Mon', temp: 24, humidity: 65, rainfall: 0 },
      { day: 'Tue', temp: 26, humidity: 60, rainfall: 2 },
      { day: 'Wed', temp: 28, humidity: 58, rainfall: 0 },
      { day: 'Thu', temp: 25, humidity: 70, rainfall: 8 },
      { day: 'Fri', temp: 23, humidity: 75, rainfall: 12 },
      { day: 'Sat', temp: 22, humidity: 72, rainfall: 5 },
      { day: 'Sun', temp: 24, humidity: 68, rainfall: 0 }
    ];

    // Resource utilization
    const resourceUtilization = [
      { name: 'Water', used: 75, total: 100, efficiency: 85 },
      { name: 'Fertilizer', used: 60, total: 80, efficiency: 90 },
      { name: 'Seeds', used: 45, total: 60, efficiency: 92 },
      { name: 'Labor', used: 80, total: 100, efficiency: 88 }
    ];

    setChartData({
      cropPerformance,
      farmProductivity,
      monthlyActivity,
      weatherTrends,
      resourceUtilization
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, change, link, subtitle, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {(change || trend) && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                {change || trend}
              </span>
              {subtitle && (
                <span className="text-sm text-gray-500 ml-1">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      {link && (
        <Link to={link} className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
          View details 
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      )}
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, link }) => (
    <Link to={link} className="group block">
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-green-300">
        <div className="flex items-center mb-4">
          <div className={`p-4 rounded-xl ${color} mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-blue-600 group-hover:text-green-600 transition-colors">
          <span className="font-medium">Get started</span>
          <Plus className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your personalized dashboard...</p>
          <p className="text-gray-500 text-sm">Preparing comprehensive farm analytics</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 rounded-xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">
              Welcome back, {user?.name || 'Farmer'}! 🌱
            </h1>
            <p className="text-green-100 text-lg mb-4">
              Here's your comprehensive farm analytics dashboard
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Target className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Efficiency: {dashboardData.stats.efficiency}%</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Award className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Growth: +{dashboardData.stats.monthlyGrowth}%</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex items-center text-sm mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{weather.temperature}°C</div>
                <div className="text-sm text-green-100">{weather.condition}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Farms"
          value={dashboardData.stats.totalFarms}
          icon={MapPin}
          color="bg-gradient-to-br from-green-500 to-green-600"
          change="+2 this month"
          link="/user-dashboard/my-farms"
          subtitle="active farms"
        />
        <StatCard
          title="My Fields"
          value={dashboardData.stats.totalFields}
          icon={BarChart3}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          change="+1 this week"
          link="/user-dashboard/my-fields"
          subtitle="productive fields"
        />
        <StatCard
          title="Active Crops"
          value={dashboardData.stats.activeCrops}
          icon={Wheat}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          change="Growing well"
          link="/user-dashboard/my-crops"
          subtitle="healthy crops"
        />
        <StatCard
          title="Total Area"
          value={`${dashboardData.stats.totalArea.toFixed(1)}`}
          icon={Activity}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          link="/user-dashboard/my-farms"
          subtitle="acres managed"
        />
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Productivity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <LineChart className="w-6 h-6 mr-2 text-green-600" />
              Farm Productivity Trends
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Production
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Efficiency
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.farmProductivity}>
              <defs>
                <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="production" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorProduction)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorEfficiency)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Activity Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <PieChart className="w-6 h-6 mr-2 text-green-600" />
            Activity Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={chartData.monthlyActivity}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.monthlyActivity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Activity']} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Weather & Crop Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Weather Widget */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Cloud className="w-6 h-6 mr-2 text-green-600" />
            Weather Insights & 7-Day Trends
          </h2>
          
          {/* Current Weather Display */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <Sun className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-900">{weather.temperature}°C</p>
                    <p className="text-gray-600 font-medium">{weather.condition}</p>
                  </div>
                </div>
                <p className="text-sm text-green-700 font-medium">{weather.forecast}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center bg-white/50 p-3 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{weather.humidity}%</p>
                <p className="text-xs text-gray-600">Humidity</p>
              </div>
              <div className="text-center bg-white/50 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{weather.windSpeed} km/h</p>
                <p className="text-xs text-gray-600">Wind Speed</p>
              </div>
              <div className="text-center bg-white/50 p-3 rounded-lg">
                <Sun className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{weather.uvIndex}</p>
                <p className="text-xs text-gray-600">UV Index</p>
              </div>
            </div>
          </div>

          {/* Weather Trends Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <RechartsLineChart data={chartData.weatherTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                name="Temperature (°C)"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Performance Analytics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Wheat className="w-6 h-6 mr-2 text-green-600" />
            Crop Performance Analytics
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData.cropPerformance}>
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
              <Bar dataKey="yield" fill="#10B981" name="Yield %" />
              <Bar dataKey="health" fill="#3B82F6" name="Health %" />
              <Bar dataKey="growth" fill="#F59E0B" name="Growth %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resource Utilization Dashboard */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-green-600" />
          Resource Utilization & Efficiency
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chartData.resourceUtilization.map((resource, index) => (
            <div key={resource.name} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                <div className="text-sm text-gray-600">
                  {resource.efficiency}% efficiency
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {resource.used}</span>
                  <span>Total: {resource.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(resource.used / resource.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-green-600">
                    {Math.round((resource.used / resource.total) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions & Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-green-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <QuickActionCard
              title="Add New Farm"
              description="Register a new farm to your portfolio"
              icon={MapPin}
              color="bg-gradient-to-br from-green-500 to-green-600"
              link="/user-dashboard/my-farms/add"
            />
            <QuickActionCard
              title="Add New Field"
              description="Create a new field for crop management"
              icon={BarChart3}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              link="/user-dashboard/my-fields/add"
            />
            <QuickActionCard
              title="Plant New Crop"
              description="Start tracking a new crop cultivation"
              icon={Wheat}
              color="bg-gradient-to-br from-yellow-500 to-yellow-600"
              link="/user-dashboard/my-crops/add"
            />
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-green-600" />
            Performance Insights
          </h2>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Excellent Growth</span>
              </div>
              <p className="text-sm text-green-700">
                Your crops are showing {dashboardData.stats.monthlyGrowth}% better growth compared to last month. Keep up the great work!
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Efficiency Score</span>
              </div>
              <p className="text-sm text-blue-700">
                Your farm efficiency is at {dashboardData.stats.efficiency}%, which is above industry average. Consider optimizing resource usage for even better results.
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-2">
                <Bell className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800">Upcoming Tasks</span>
              </div>
              <p className="text-sm text-yellow-700">
                {dashboardData.stats.readyToHarvest > 0 
                  ? `${dashboardData.stats.readyToHarvest} crop(s) are ready for harvest. Plan your harvesting schedule.`
                  : "All crops are in good condition. Continue monitoring and maintenance."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Farms */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-green-600" />
              My Recent Farms
            </h2>
            <Link to="/user-dashboard/my-farms" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all →
            </Link>
          </div>
          {dashboardData.farms.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.farms.map((farm, index) => (
                <div key={farm.farmId || farm.id || `farm-${index}`} className="group p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                          {farm.name}
                        </p>
                        <p className="text-sm text-gray-600">{farm.location}</p>
                        <div className="flex items-center mt-1">
                          <Activity className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{farm.area}</span>
                      <p className="text-sm text-gray-500">acres</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No farms yet</p>
              <p className="text-sm text-gray-400 mb-4">Start your farming journey today</p>
              <Link 
                to="/user-dashboard/my-farms/add" 
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first farm
              </Link>
            </div>
          )}
        </div>

        {/* Active Crops */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Wheat className="w-6 h-6 mr-2 text-green-600" />
              Active Crops
            </h2>
            <Link to="/user-dashboard/my-crops" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all →
            </Link>
          </div>
          {dashboardData.crops.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.crops.map((crop, index) => (
                <div key={crop.cropId || crop.id || `crop-${index}`} className="group p-4 bg-gray-50 hover:bg-yellow-50 rounded-xl border border-gray-200 hover:border-yellow-300 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <Wheat className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors">
                          {crop.name}
                        </p>
                        <p className="text-sm text-gray-600">{crop.fieldName}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${70 + (index * 10)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{70 + (index * 10)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        crop.status === 'growing' ? 'bg-green-100 text-green-800 border border-green-200' :
                        crop.status === 'harvesting' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {crop.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wheat className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No crops planted yet</p>
              <p className="text-sm text-gray-400 mb-4">Start growing your first crop</p>
              <Link 
                to="/user-dashboard/my-crops/add" 
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Plant your first crop
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Alerts & Notifications */}
      {dashboardData.stats.readyToHarvest > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-yellow-800">
                🎉 {dashboardData.stats.readyToHarvest} crop(s) ready for harvest!
              </h3>
              <p className="text-yellow-700 mt-1">
                Congratulations! Your hard work is paying off. Check your crops that are ready to be harvested and plan your harvesting schedule.
              </p>
            </div>
            <Link 
              to="/user-dashboard/my-crops" 
              className="ml-4 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              View crops →
            </Link>
          </div>
        </div>
      )}

      {/* Success Message for High Performance */}
      {dashboardData.stats.efficiency > 90 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-green-800">
                🏆 Outstanding Farm Performance!
              </h3>
              <p className="text-green-700 mt-1">
                Your farm efficiency is at {dashboardData.stats.efficiency}%! You're in the top 10% of farmers on our platform. Keep up the excellent work!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
