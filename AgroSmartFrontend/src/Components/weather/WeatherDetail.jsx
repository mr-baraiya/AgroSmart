import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Gauge, MapPin, Calendar, Clock } from "lucide-react";
import { weatherService } from "../../services";
import CustomAlert from "../common/CustomAlert";

const WeatherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  useEffect(() => {
    fetchWeatherData();
  }, [id]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await weatherService.getById(id);
      setWeather(response.data);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for alerts
  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      showCancel
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const handleEdit = () => {
    navigate(`/dashboard/weather/edit/${id}`);
  };

  const handleDelete = () => {
    showAlert(
      'confirm',
      'Delete Weather Data',
      `Are you sure you want to delete weather data for "${weather.location}"? This action cannot be undone.`,
      async () => {
        try {
          await weatherService.delete(id);
          closeAlert();
          navigate("/dashboard/weather", {
            state: {
              message: `Weather data for "${weather.location}" deleted successfully!`,
              type: "success"
            }
          });
        } catch (err) {
          console.error("Error deleting weather data:", err);
          closeAlert();
          showAlert(
            'error',
            'Delete Failed',
            `Failed to delete weather data for "${weather.location}". Please try again.`
          );
        }
      },
      true
    );
  };

  const handleBack = () => {
    navigate("/dashboard/weather");
  };

  // Get weather icon based on description
  const getWeatherIcon = (description, size = "w-16 h-16") => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('rain') || desc.includes('storm') || desc.includes('shower')) {
      return <CloudRain className={`${size} text-blue-600`} />;
    }
    if (desc.includes('cloud') || desc.includes('overcast')) {
      return <Cloud className={`${size} text-gray-500`} />;
    }
    if (desc.includes('wind')) {
      return <Wind className={`${size} text-gray-600`} />;
    }
    return <Sun className={`${size} text-yellow-500`} />;
  };

  // Get temperature color and description
  const getTemperatureInfo = (temp) => {
    if (temp >= 35) return { color: 'text-red-600', desc: 'Very Hot' };
    if (temp >= 25) return { color: 'text-orange-500', desc: 'Warm' };
    if (temp >= 15) return { color: 'text-yellow-500', desc: 'Mild' };
    if (temp >= 5) return { color: 'text-blue-500', desc: 'Cool' };
    if (temp >= 0) return { color: 'text-blue-600', desc: 'Cold' };
    return { color: 'text-blue-800', desc: 'Very Cold' };
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch {
      return { date: 'Invalid Date', time: '' };
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

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <CloudRain className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Weather data not found</p>
          </div>
        </div>
      </div>
    );
  }

  const temperatureInfo = getTemperatureInfo(weather.temperature);
  const forecastDate = formatDate(weather.forecastDate);
  const retrievedDate = formatDate(weather.retrievedAt);

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-3 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.weatherDescription, "w-8 h-8")}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-800 to-blue-600 bg-clip-text text-transparent">
              Weather Details - {weather.location}
            </h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Edit className="w-5 h-5" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {getWeatherIcon(weather.weatherDescription, "w-20 h-20")}
              <div>
                <h2 className="text-4xl font-bold mb-2">{weather.location}</h2>
                <p className="text-sky-100 capitalize text-lg">
                  {weather.weatherDescription || 'No description'}
                </p>
                {weather.dataType && (
                  <span className="inline-block bg-sky-400 text-sky-900 px-3 py-1 rounded-full text-sm font-medium mt-2">
                    {weather.dataType.charAt(0).toUpperCase() + weather.dataType.slice(1)} Data
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-6xl font-bold mb-2 ${temperatureInfo.color.replace('text-', 'text-white')}`}>
                {weather.temperature}°C
              </div>
              <p className="text-sky-100 text-lg">{temperatureInfo.desc}</p>
            </div>
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Humidity */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Droplets className="w-8 h-8 text-blue-600" />
                <h3 className="font-semibold text-blue-800 text-lg">Humidity</h3>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-700">{weather.humidity}%</div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(weather.humidity, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Wind className="w-8 h-8 text-gray-600" />
                <h3 className="font-semibold text-gray-800 text-lg">Wind Speed</h3>
              </div>
              <div className="text-3xl font-bold text-gray-700">{weather.windSpeed} km/h</div>
            </div>

            {/* Pressure */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Gauge className="w-8 h-8 text-purple-600" />
                <h3 className="font-semibold text-purple-800 text-lg">Pressure</h3>
              </div>
              <div className="text-3xl font-bold text-purple-700">{weather.pressure} hPa</div>
            </div>

            {/* Temperature Detail */}
            <div className={`bg-gradient-to-br p-6 rounded-xl border ${
              weather.temperature >= 25 
                ? 'from-orange-50 to-red-100 border-orange-200' 
                : 'from-blue-50 to-cyan-100 border-blue-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Thermometer className={`w-8 h-8 ${
                  weather.temperature >= 25 ? 'text-orange-600' : 'text-blue-600'
                }`} />
                <h3 className={`font-semibold text-lg ${
                  weather.temperature >= 25 ? 'text-orange-800' : 'text-blue-800'
                }`}>Temperature</h3>
              </div>
              <div className={`text-3xl font-bold ${
                weather.temperature >= 25 ? 'text-orange-700' : 'text-blue-700'
              }`}>
                {weather.temperature}°C
              </div>
              <div className={`text-sm font-medium mt-1 ${
                weather.temperature >= 25 ? 'text-orange-600' : 'text-blue-600'
              }`}>
                {temperatureInfo.desc}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location and Timing Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Location Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-sky-600" />
            <h3 className="text-xl font-semibold text-sky-800">Location Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="text-lg font-semibold text-gray-800">{weather.location}</p>
            </div>
            
            {weather.latitude && weather.longitude && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Latitude</label>
                  <p className="text-lg font-semibold text-gray-800">{weather.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Longitude</label>
                  <p className="text-lg font-semibold text-gray-800">{weather.longitude.toFixed(6)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timing Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-sky-600" />
            <h3 className="text-xl font-semibold text-sky-800">Timing Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Forecast Date</label>
              <p className="text-lg font-semibold text-gray-800">{forecastDate.date}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {forecastDate.time}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Data Retrieved</label>
              <p className="text-lg font-semibold text-gray-800">{retrievedDate.date}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {retrievedDate.time}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        onConfirm={alert.onConfirm}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        showCancel={alert.showCancel}
        confirmText={alert.type === 'confirm' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default WeatherDetail;
