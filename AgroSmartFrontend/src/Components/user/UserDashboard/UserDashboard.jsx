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
  Sun
} from 'lucide-react';
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
      readyToHarvest: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [weather] = useState({
    temperature: 24,
    humidity: 65,
    condition: 'Partly Cloudy',
    forecast: 'Good farming conditions'
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
        readyToHarvest: crops.filter(crop => crop.status === 'harvesting').length
      };

      setDashboardData({
        farms: farms.slice(0, 3), // Show only first 3
        fields: fields.slice(0, 3),
        crops: crops.slice(0, 3),
        stats
      });
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
          readyToHarvest: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, link }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {link && (
        <Link to={link} className="block mt-4 text-sm text-blue-600 hover:text-blue-800">
          View details →
        </Link>
      )}
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, link }) => (
    <Link to={link} className="block">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-green-300">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full ${color} mr-4`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-blue-600">
          <span>Get started</span>
          <Plus className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-sm text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name || 'Farmer'}! 🌱
            </h1>
            <p className="text-green-100">
              Here's what's happening with your farms today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Farms"
          value={dashboardData.stats.totalFarms}
          icon={MapPin}
          color="bg-green-500"
          change="+2 this month"
          link="/user-dashboard/my-farms"
        />
        <StatCard
          title="My Fields"
          value={dashboardData.stats.totalFields}
          icon={BarChart3}
          color="bg-blue-500"
          change="+1 this week"
          link="/user-dashboard/my-fields"
        />
        <StatCard
          title="Active Crops"
          value={dashboardData.stats.activeCrops}
          icon={Wheat}
          color="bg-yellow-500"
          change="Growing well"
          link="/user-dashboard/my-crops"
        />
        <StatCard
          title="Total Area"
          value={`${dashboardData.stats.totalArea.toFixed(1)} acres`}
          icon={Activity}
          color="bg-purple-500"
          link="/user-dashboard/my-farms"
        />
      </div>

      {/* Weather Widget */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Cloud className="w-5 h-5 mr-2" />
          Today's Weather
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full mr-4">
              <Thermometer className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{weather.temperature}°C</p>
              <p className="text-sm text-gray-600">Temperature</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{weather.humidity}%</p>
              <p className="text-sm text-gray-600">Humidity</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full mr-4">
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{weather.condition}</p>
              <p className="text-sm text-gray-600">{weather.forecast}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Add New Farm"
            description="Register a new farm to your portfolio"
            icon={MapPin}
            color="bg-green-500"
            link="/user-dashboard/my-farms/add"
          />
          <QuickActionCard
            title="Add New Field"
            description="Create a new field for crop management"
            icon={BarChart3}
            color="bg-blue-500"
            link="/user-dashboard/my-fields/add"
          />
          <QuickActionCard
            title="Plant New Crop"
            description="Start tracking a new crop cultivation"
            icon={Wheat}
            color="bg-yellow-500"
            link="/user-dashboard/my-crops/add"
          />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Farms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Farms</h2>
            <Link to="/user-dashboard/my-farms" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          {dashboardData.farms.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.farms.map((farm, index) => (
                <div key={farm.farmId || farm.id || `farm-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{farm.name}</p>
                      <p className="text-sm text-gray-600">{farm.location}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{farm.area} acres</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No farms yet</p>
              <Link to="/user-dashboard/my-farms/add" className="text-sm text-blue-600 hover:text-blue-800">
                Add your first farm
              </Link>
            </div>
          )}
        </div>

        {/* Recent Crops */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Crops</h2>
            <Link to="/user-dashboard/my-crops" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          {dashboardData.crops.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.crops.map((crop, index) => (
                <div key={crop.cropId || crop.id || `crop-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Wheat className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{crop.name}</p>
                      <p className="text-sm text-gray-600">{crop.fieldName}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    crop.status === 'growing' ? 'bg-green-100 text-green-800' :
                    crop.status === 'harvesting' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {crop.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wheat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No crops planted yet</p>
              <Link to="/user-dashboard/my-crops/add" className="text-sm text-blue-600 hover:text-blue-800">
                Plant your first crop
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Alerts & Notifications */}
      {dashboardData.stats.readyToHarvest > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {dashboardData.stats.readyToHarvest} crop(s) ready for harvest!
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Check your crops that are ready to be harvested.
              </p>
            </div>
            <Link to="/user-dashboard/my-crops" className="ml-auto text-sm text-yellow-800 hover:text-yellow-900 font-medium">
              View crops →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
