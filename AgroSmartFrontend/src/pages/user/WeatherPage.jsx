import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  Eye,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const WeatherPage = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [weatherChartData, setWeatherChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('temperature');

  useEffect(() => {
    // Mock data - replace with actual weather API
    const mockCurrentWeather = {
      temperature: 24,
      condition: 'sunny',
      location: 'Farm Location',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      uvIndex: 6,
      sunrise: '06:30',
      sunset: '19:45',
      feelsLike: 26,
      pressure: 1013
    };

    const mockHourlyForecast = [
      { time: '09:00', temp: 22, rain: 0, wind: 10, icon: 'sunny' },
      { time: '10:00', temp: 24, rain: 5, wind: 12, icon: 'partly-cloudy' },
      { time: '11:00', temp: 26, rain: 10, wind: 15, icon: 'cloudy' },
      { time: '12:00', temp: 28, rain: 15, wind: 18, icon: 'rain' },
      { time: '13:00', temp: 27, rain: 20, wind: 16, icon: 'rain' },
      { time: '14:00', temp: 25, rain: 10, wind: 14, icon: 'partly-cloudy' },
      { time: '15:00', temp: 23, rain: 5, wind: 12, icon: 'sunny' },
      { time: '16:00', temp: 21, rain: 0, wind: 10, icon: 'sunny' }
    ];

    const mockWeeklyForecast = [
      { day: 'Today', high: 28, low: 18, condition: 'sunny', rain: 10 },
      { day: 'Tomorrow', high: 26, low: 16, condition: 'partly-cloudy', rain: 30 },
      { day: 'Wednesday', high: 24, low: 14, condition: 'rain', rain: 80 },
      { day: 'Thursday', high: 22, low: 12, condition: 'cloudy', rain: 60 },
      { day: 'Friday', high: 25, low: 15, condition: 'partly-cloudy', rain: 20 },
      { day: 'Saturday', high: 27, low: 17, condition: 'sunny', rain: 5 },
      { day: 'Sunday', high: 29, low: 19, condition: 'sunny', rain: 0 }
    ];

    const mockChartData = [
      { name: 'Mon', temperature: 22, rainfall: 5, humidity: 60 },
      { name: 'Tue', temperature: 24, rainfall: 12, humidity: 65 },
      { name: 'Wed', temperature: 26, rainfall: 8, humidity: 70 },
      { name: 'Thu', temperature: 23, rainfall: 15, humidity: 75 },
      { name: 'Fri', temperature: 25, rainfall: 3, humidity: 55 },
      { name: 'Sat', temperature: 27, rainfall: 0, humidity: 50 },
      { name: 'Sun', temperature: 28, rainfall: 2, humidity: 45 }
    ];

    setCurrentWeather(mockCurrentWeather);
    setHourlyForecast(mockHourlyForecast);
    setWeeklyForecast(mockWeeklyForecast);
    setWeatherChartData(mockChartData);
  }, []);

  const getWeatherIcon = (condition, size = 'w-8 h-8') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'partly-cloudy':
        return <Cloud className={`${size} text-gray-400`} />;
      case 'cloudy':
        return <Cloud className={`${size} text-gray-600`} />;
      case 'rain':
        return <CloudRain className={`${size} text-blue-500`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getBackgroundGradient = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400';
      case 'partly-cloudy':
        return 'bg-gradient-to-br from-gray-400 via-gray-500 to-blue-400';
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
      case 'rain':
        return 'bg-gradient-to-br from-gray-600 via-blue-600 to-blue-800';
      default:
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400';
    }
  };

  if (!currentWeather) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Weather Widget */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${getBackgroundGradient(currentWeather.condition)}`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between text-white">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{currentWeather.location}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-6">
                {getWeatherIcon(currentWeather.condition, 'w-16 h-16')}
                <div>
                  <div className="text-6xl font-bold">{currentWeather.temperature}°</div>
                  <div className="text-xl opacity-90 capitalize">{currentWeather.condition}</div>
                  <div className="text-sm opacity-75">Feels like {currentWeather.feelsLike}°</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Droplets className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                <div className="text-sm opacity-75">Humidity</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Wind className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.windSpeed}</div>
                <div className="text-sm opacity-75">km/h</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Eye className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.visibility}</div>
                <div className="text-sm opacity-75">km</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Sun className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentWeather.uvIndex}</div>
                <div className="text-sm opacity-75">UV Index</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hourly Forecast */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Hourly Forecast</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {hourlyForecast.map((hour, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 bg-gray-50 rounded-xl p-4 text-center min-w-[120px]"
              >
                <div className="text-sm text-gray-600 mb-2">{hour.time}</div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(hour.icon, 'w-8 h-8')}
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1">{hour.temp}°</div>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  <span>{hour.rain}%</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 mt-1">
                  <Wind className="w-4 h-4 text-gray-400" />
                  <span>{hour.wind}km/h</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 7-Day Forecast */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">7-Day Forecast</h3>
            <div className="space-y-4">
              {weeklyForecast.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getWeatherIcon(day.condition)}
                    <div>
                      <div className="font-medium text-gray-900">{day.day}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CloudRain className="w-4 h-4 text-blue-500" />
                        <span>{day.rain}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="w-4 h-4 text-red-500" />
                        <span className="font-bold text-gray-900">{day.high}°</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowDown className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">{day.low}°</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Weather Charts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Weather Trends</h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('temperature')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'temperature' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Temperature
                </button>
                <button
                  onClick={() => setActiveTab('rainfall')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'rainfall' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rainfall
                </button>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'temperature' ? (
                  <LineChart data={weatherChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={weatherChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rainfall" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Additional Weather Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mt-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Sunrise className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{currentWeather.sunrise}</div>
              <div className="text-sm text-gray-600">Sunrise</div>
            </div>
            <div className="text-center">
              <Sunset className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{currentWeather.sunset}</div>
              <div className="text-sm text-gray-600">Sunset</div>
            </div>
            <div className="text-center">
              <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{currentWeather.pressure}</div>
              <div className="text-sm text-gray-600">Pressure (hPa)</div>
            </div>
            <div className="text-center">
              <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{currentWeather.uvIndex}</div>
              <div className="text-sm text-gray-600">UV Index</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WeatherPage;
