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
  MapPin,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { realTimeWeatherService } from '../../services/realTimeWeatherService';

const WeatherPage = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [weatherChartData, setWeatherChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('temperature');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('Rajkot'); // Default to Rajkot, Gujarat

  // Fetch real weather data
  const fetchWeatherData = async (location = currentLocation) => {
    try {
      setLoading(true);
      setError(null);

      // Get current weather
      const current = await realTimeWeatherService.getCurrentWeatherByCity(location);
      
      // Get 5-day/3-hour forecast (this is available in free plan)
      const forecast = await realTimeWeatherService.getForecastByCity(location);

      // Transform current weather data
      const transformedCurrent = {
        temperature: Math.round(current.main.temp),
        condition: current.weather[0].main.toLowerCase(),
        location: current.name,
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(current.visibility / 1000), // Convert to km
        uvIndex: 'N/A', // Not available in free API
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        feelsLike: Math.round(current.main.feels_like),
        pressure: current.main.pressure,
        description: current.weather[0].description
      };

      // Transform 3-hour forecast data (available in free plan)
      // Show next 8 forecasts (24 hours worth since it's every 3 hours)
      const transformedHourly = forecast.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        date: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        temp: Math.round(item.main.temp),
        rain: item.rain ? Math.round(item.rain['3h'] || 0) : 0,
        wind: Math.round(item.wind.speed * 3.6),
        icon: item.weather[0].main.toLowerCase(),
        humidity: item.main.humidity,
        description: item.weather[0].description
      }));

      // Transform daily forecast from 3-hour data
      // Group by day and take one forecast per day (around noon)
      const dailyForecasts = {};
      forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        const hour = date.getHours();
        
        // Take forecast around noon (12:00) for daily representation
        if (hour >= 12 && hour <= 15) {
          if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = item;
          }
        }
      });

      const transformedWeekly = Object.values(dailyForecasts).slice(0, 5).map((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
        
        return {
          day: dayName,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          high: Math.round(day.main.temp_max),
          low: Math.round(day.main.temp_min),
          temp: Math.round(day.main.temp),
          condition: day.weather[0].main.toLowerCase(),
          rain: day.rain ? Math.round((day.rain['3h'] || 0)) : 0,
          description: day.weather[0].description,
          humidity: day.main.humidity,
          windSpeed: Math.round(day.wind.speed * 3.6)
        };
      });

      // Transform chart data from available forecasts
      const transformedChart = transformedWeekly.map(day => ({
        name: day.day.substring(0, 3),
        temperature: day.temp,
        rainfall: day.rain,
        humidity: day.humidity
      }));

      setCurrentWeather(transformedCurrent);
      setHourlyForecast(transformedHourly);
      setWeeklyForecast(transformedWeekly);
      setWeatherChartData(transformedChart);

    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
      
      // Fallback to mock data if API fails
      setCurrentWeather({
        temperature: 24,
        condition: 'clear',
        location: location,
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        uvIndex: 'N/A',
        sunrise: '06:30',
        sunset: '19:45',
        feelsLike: 26,
        pressure: 1013,
        description: 'Clear sky'
      });
      
      // Mock hourly data
      setHourlyForecast([
        { time: '09:00', date: 'Today', temp: 22, rain: 0, wind: 10, icon: 'clear', humidity: 60, description: 'Clear' },
        { time: '12:00', date: 'Today', temp: 26, rain: 0, wind: 12, icon: 'clear', humidity: 55, description: 'Sunny' },
        { time: '15:00', date: 'Today', temp: 28, rain: 0, wind: 15, icon: 'clear', humidity: 50, description: 'Sunny' },
        { time: '18:00', date: 'Today', temp: 25, rain: 0, wind: 12, icon: 'clear', humidity: 60, description: 'Clear' }
      ]);
      
      // Mock weekly data
      setWeeklyForecast([
        { day: 'Today', date: 'Sep 7', high: 28, low: 18, temp: 24, condition: 'clear', rain: 0, description: 'Clear sky', humidity: 65, windSpeed: 12 },
        { day: 'Tomorrow', date: 'Sep 8', high: 26, low: 16, temp: 22, condition: 'clouds', rain: 0, description: 'Partly cloudy', humidity: 70, windSpeed: 10 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle location change
  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    fetchWeatherData(newLocation);
  };

  // Refresh weather data
  const handleRefresh = () => {
    fetchWeatherData(currentLocation);
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (condition, size = 'w-8 h-8') => {
    const lowerCondition = condition?.toLowerCase();
    switch (lowerCondition) {
      case 'clear':
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'clouds':
      case 'partly-cloudy':
      case 'cloudy':
        return <Cloud className={`${size} text-gray-400`} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'snow':
        return <Cloud className={`${size} text-white`} />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <Cloud className={`${size} text-gray-600`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getBackgroundGradient = (condition) => {
    const lowerCondition = condition?.toLowerCase();
    switch (lowerCondition) {
      case 'clear':
      case 'sunny':
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400';
      case 'clouds':
      case 'partly-cloudy':
        return 'bg-gradient-to-br from-gray-400 via-gray-500 to-blue-400';
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
      case 'rain':
      case 'drizzle':
        return 'bg-gradient-to-br from-gray-600 via-blue-600 to-blue-800';
      case 'snow':
        return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
      default:
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Weather Data...</h2>
          <p className="text-gray-500">Getting current conditions for {currentLocation}</p>
        </div>
      </div>
    );
  }

  if (error && !currentWeather) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Cloud className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Weather Unavailable</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location Controls */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Weather Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <select
                  value={currentLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                >
                  {/* Indian Cities Only */}
                  <option value="Rajkot">Rajkot</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Surat">Surat</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Kanpur">Kanpur</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Indore">Indore</option>
                  <option value="Thane">Thane</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Pimpri-Chinchwad">Pimpri-Chinchwad</option>
                  <option value="Patna">Patna</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Agra">Agra</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Faridabad">Faridabad</option>
                  <option value="Meerut">Meerut</option>
                  <option value="Kalyan-Dombivli">Kalyan-Dombivli</option>
                  <option value="Vasai-Virar">Vasai-Virar</option>
                  <option value="Varanasi">Varanasi</option>
                </select>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Hero Weather Widget */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${getBackgroundGradient(currentWeather?.condition || 'clear')}`}
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
                  <div className="text-xl opacity-90 capitalize">{currentWeather.description || currentWeather.condition}</div>
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
        {/* 3-Hour Forecast */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">3-Hour Forecast (Next 24 Hours)</h3>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {hourlyForecast.map((hour, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 bg-gray-50 rounded-xl p-4 text-center min-w-[120px]"
              >
                <div className="text-xs text-gray-500 mb-1">{hour.date}</div>
                <div className="text-sm text-gray-600 mb-2">{hour.time}</div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(hour.icon, 'w-8 h-8')}
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1">{hour.temp}°</div>
                <div className="text-xs text-gray-500 mb-1 capitalize">{hour.description}</div>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span>{hour.humidity}%</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 mt-1">
                  <Wind className="w-3 h-3 text-gray-400" />
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
