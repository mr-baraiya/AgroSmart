import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer,
  MapPin,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Sunrise,
  Sunset,
  AlertTriangle,
  BarChart3,
  Wheat,
  Star,
  Zap
} from 'lucide-react';
import { realTimeWeatherService } from '../../services/realTimeWeatherService';

const WeatherPage = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('pending'); // 'pending', 'granted', 'denied'
  const [isUsingLocation, setIsUsingLocation] = useState(false);

  // Default cities for quick access
  const popularCities = [
    'New York', 'London', 'Paris', 'Tokyo', 'Mumbai', 'Delhi', 
    'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setLocationPermission('granted');
          setIsUsingLocation(true);
          await fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          setIsUsingLocation(false);
          // Fallback to default city
          fetchWeatherData('New York');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationPermission('denied');
      setError('Geolocation is not supported by your browser.');
      fetchWeatherData('New York');
    }
  };

  // Fetch weather data by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current weather and forecast by coordinates
      const [currentResponse, forecastResponse] = await Promise.all([
        realTimeWeatherService.getCurrentWeatherByCoords(lat, lon),
        realTimeWeatherService.getForecastByCoords(lat, lon)
      ]);

      setCurrentWeather(currentResponse);
      setSelectedCity(`${currentResponse.name}, ${currentResponse.sys.country}`);
      
      // Process forecast data (get daily forecasts)
      const dailyForecasts = forecastResponse.list
        .filter((item, index) => index % 8 === 0) // Get one forecast per day
        .slice(0, 5); // Get 5 days
      
      setForecast(dailyForecasts);
    } catch (err) {
      setError('Failed to fetch weather data for your location. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data by city name
  const fetchWeatherData = async (city = selectedCity) => {
    try {
      setLoading(true);
      setError(null);
      setIsUsingLocation(false);
      
      // Fetch current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        realTimeWeatherService.getCurrentWeatherByCity(city),
        realTimeWeatherService.getForecastByCity(city)
      ]);

      setCurrentWeather(currentResponse);
      
      // Process forecast data (get daily forecasts)
      const dailyForecasts = forecastResponse.list
        .filter((item, index) => index % 8 === 0) // Get one forecast per day
        .slice(0, 5); // Get 5 days
      
      setForecast(dailyForecasts);
      setSelectedCity(city);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load - try to get user location first
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Auto-refresh every 10 minutes for current location or selected city
  useEffect(() => {
    if (currentWeather) {
      const interval = setInterval(() => {
        if (isUsingLocation && userLocation) {
          fetchWeatherByCoords(userLocation.lat, userLocation.lon);
        } else if (selectedCity) {
          fetchWeatherData(selectedCity);
        }
      }, 10 * 60 * 1000); // 10 minutes

      return () => clearInterval(interval);
    }
  }, [currentWeather, isUsingLocation, userLocation, selectedCity]);

  // Get weather icon based on weather condition
  const getWeatherIcon = (weatherMain, size = 'w-8 h-8') => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'clouds':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'rain':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`${size} text-blue-300`} />;
      default:
        return <Cloud className={`${size} text-gray-500`} />;
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity.trim());
      setSearchCity('');
    }
  };

  if (loading && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 text-center max-w-md"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Weather Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchWeatherData()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white"
            >
              🌤️ Real-Time Weather
            </motion.h1>
            
            {/* Search */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Search city..."
                  className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  Search
                </button>
              </form>
              
              <button
                onClick={() => fetchWeatherData()}
                disabled={loading}
                className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Permission Banner */}
        {locationPermission === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 mb-6 border border-blue-300/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-300" />
                <span className="text-white font-medium">
                  Getting your location for personalized weather...
                </span>
              </div>
              <div className="animate-spin">
                <RefreshCw className="w-5 h-5 text-blue-300" />
              </div>
            </div>
          </motion.div>
        )}

        {locationPermission === 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 backdrop-blur-md rounded-xl p-4 mb-6 border border-yellow-300/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-yellow-300" />
                <span className="text-white">
                  Location access denied. You can still search for any city below.
                </span>
              </div>
              <button
                onClick={getCurrentLocation}
                className="px-3 py-1 bg-yellow-500/30 text-white rounded-lg hover:bg-yellow-500/50 transition-colors text-sm"
              >
                Enable Location
              </button>
            </div>
          </motion.div>
        )}

        {/* Premium Features Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="w-6 h-6 text-yellow-400" />
                </motion.div>
                Want More Weather Features?
              </h3>
              <p className="text-white/80">
                Create an account to get weather alerts, historical data, crop-specific forecasts, and more!
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/auth/register"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold whitespace-nowrap"
              >
                Create Account
              </Link>
              <Link
                to="/auth/login"
                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold whitespace-nowrap border border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
        {/* Popular Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="text-white font-semibold mb-3">Quick Access</h3>
          <div className="flex flex-wrap gap-2">
            {/* Use My Location Button */}
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-2 ${
                isUsingLocation
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <MapPin className="w-3 h-3" />
              {loading && locationPermission === 'pending' ? 'Getting Location...' : 'My Location'}
            </button>
            
            {/* Popular Cities */}
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => fetchWeatherData(city)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCity === city && !isUsingLocation
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        {currentWeather && (
          <>
            {/* Current Weather Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className={`w-5 h-5 ${isUsingLocation ? 'text-green-300' : 'text-white'}`} />
                  <h2 className="text-xl font-bold text-white">
                    {currentWeather.name}, {currentWeather.sys.country}
                    {isUsingLocation && (
                      <span className="ml-2 text-sm bg-green-500/30 px-2 py-1 rounded-full text-green-200">
                        📍 Your Location
                      </span>
                    )}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-white/80 text-sm">
                    Last updated: {formatTime(currentWeather.dt)}
                  </div>
                  {isUsingLocation && (
                    <button
                      onClick={() => fetchWeatherByCoords(userLocation.lat, userLocation.lon)}
                      disabled={loading}
                      className="p-1 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-colors"
                      title="Refresh location weather"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Weather Info */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    {getWeatherIcon(currentWeather.weather[0].main, 'w-20 h-20')}
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {Math.round(currentWeather.main.temp)}°C
                    </div>
                    <div className="text-white/80 text-lg capitalize">
                      {currentWeather.weather[0].description}
                    </div>
                    <div className="text-white/60 text-sm">
                      Feels like {Math.round(currentWeather.main.feels_like)}°C
                    </div>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-300" />
                      <span className="text-white/80 text-sm">Humidity</span>
                    </div>
                    <div className="text-white font-semibold">{currentWeather.main.humidity}%</div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wind className="w-4 h-4 text-green-300" />
                      <span className="text-white/80 text-sm">Wind Speed</span>
                    </div>
                    <div className="text-white font-semibold">{currentWeather.wind.speed} m/s</div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-purple-300" />
                      <span className="text-white/80 text-sm">Visibility</span>
                    </div>
                    <div className="text-white font-semibold">{(currentWeather.visibility / 1000).toFixed(1)} km</div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-4 h-4 text-red-300" />
                      <span className="text-white/80 text-sm">Pressure</span>
                    </div>
                    <div className="text-white font-semibold">{currentWeather.main.pressure} hPa</div>
                  </div>
                </div>
              </div>

              {/* Sun times */}
              <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-5 h-5 text-yellow-300" />
                  <span className="text-white/80">Sunrise</span>
                  <span className="text-white font-semibold">{formatTime(currentWeather.sys.sunrise)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="w-5 h-5 text-orange-300" />
                  <span className="text-white/80">Sunset</span>
                  <span className="text-white font-semibold">{formatTime(currentWeather.sys.sunset)}</span>
                </div>
              </div>
            </motion.div>

            {/* 5-Day Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                5-Day Forecast
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 rounded-lg p-4 text-center"
                  >
                    <div className="text-white/80 text-sm mb-2">
                      {formatDate(day.dt)}
                    </div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.weather[0].main, 'w-8 h-8')}
                    </div>
                    <div className="text-white font-semibold text-lg mb-1">
                      {Math.round(day.main.temp)}°C
                    </div>
                    <div className="text-white/60 text-xs capitalize">
                      {day.weather[0].description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Premium Features Call-to-Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <div className="text-center">
                <motion.h3 
                  className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🌟
                  </motion.span>
                  Unlock Premium Weather Features
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="flex justify-center mb-3"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="p-3 bg-red-500/20 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                      </div>
                    </motion.div>
                    <h4 className="font-semibold text-white mb-1">Weather Alerts</h4>
                    <p className="text-white/70 text-sm">Get notifications for severe weather conditions</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="flex justify-center mb-3"
                      whileHover={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-3 bg-blue-500/20 rounded-full">
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                      </div>
                    </motion.div>
                    <h4 className="font-semibold text-white mb-1">Historical Data</h4>
                    <p className="text-white/70 text-sm">Access past weather patterns and trends</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="flex justify-center mb-3"
                      whileHover={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="p-3 bg-green-500/20 rounded-full">
                        <Wheat className="w-8 h-8 text-green-400" />
                      </div>
                    </motion.div>
                    <h4 className="font-semibold text-white mb-1">Crop Insights</h4>
                    <p className="text-white/70 text-sm">Weather recommendations for your specific crops</p>
                  </motion.div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/auth/register"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/auth/login"
                    className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold border border-white/30"
                  >
                    Already have an account?
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
