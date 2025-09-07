import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Eye, Droplets, Thermometer, Activity } from 'lucide-react';
import { realTimeWeatherService } from '../../services/realTimeWeatherService';

const DynamicWeatherWidget = ({ 
  location = null, 
  coordinates = null, 
  showForecast = false,
  className = "" 
}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get weather icon based on weather condition
  const getWeatherIcon = (weatherMain, size = 48) => {
    const iconProps = { size, className: "text-white" };
    
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} className="text-yellow-300" />;
      case 'clouds':
        return <Cloud {...iconProps} className="text-gray-300" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain {...iconProps} className="text-blue-300" />;
      case 'snow':
        return <Cloud {...iconProps} className="text-white" />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <Cloud {...iconProps} className="text-gray-400" />;
      default:
        return <Sun {...iconProps} className="text-yellow-300" />;
    }
  };

  // Get background gradient based on weather
  const getWeatherGradient = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'clouds':
        return 'from-gray-400 via-gray-500 to-gray-600';
      case 'rain':
      case 'drizzle':
        return 'from-blue-600 via-blue-700 to-blue-800';
      case 'snow':
        return 'from-gray-300 via-gray-400 to-gray-500';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'from-gray-500 via-gray-600 to-gray-700';
      default:
        return 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  // Fetch weather data
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      let currentWeather;
      let forecast;

      if (coordinates && coordinates.lat && coordinates.lon) {
        // Use coordinates if provided
        currentWeather = await realTimeWeatherService.getCurrentWeatherByCoords(
          coordinates.lat, 
          coordinates.lon
        );
        if (showForecast) {
          forecast = await realTimeWeatherService.getForecastByCoords(
            coordinates.lat, 
            coordinates.lon
          );
        }
      } else if (location) {
        // Use location name if provided
        currentWeather = await realTimeWeatherService.getCurrentWeatherByCity(location);
        if (showForecast) {
          forecast = await realTimeWeatherService.getForecastByCity(location);
        }
      } else {
        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              
              const weather = await realTimeWeatherService.getCurrentWeatherByCoords(lat, lon);
              setWeatherData(weather);
              
              if (showForecast) {
                const forecast = await realTimeWeatherService.getForecastByCoords(lat, lon);
                setForecastData(forecast);
              }
              setLoading(false);
            },
            (error) => {
              console.error('Geolocation error:', error);
              setError('Unable to get your location. Please provide a city name or coordinates.');
              setLoading(false);
            }
          );
          return;
        } else {
          throw new Error('Geolocation is not supported by this browser and no location provided.');
        }
      }

      setWeatherData(currentWeather);
      if (showForecast && forecast) {
        setForecastData(forecast);
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location, coordinates, showForecast]);

  // Refresh weather data
  const handleRefresh = () => {
    fetchWeatherData();
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-white bg-opacity-30 rounded w-32"></div>
            <div className="h-12 w-12 bg-white bg-opacity-30 rounded-full"></div>
          </div>
          <div className="h-8 bg-white bg-opacity-30 rounded w-20 mb-2"></div>
          <div className="h-4 bg-white bg-opacity-30 rounded w-40"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-6 text-white ${className}`}>
        <div className="text-center">
          <Cloud size={48} className="mx-auto mb-4 text-white opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Weather Unavailable</h3>
          <p className="text-sm opacity-90 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const gradient = getWeatherGradient(weatherData.weather?.[0]?.main);

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-lg p-6 text-white shadow-lg ${className}`}>
      {/* Current Weather */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{weatherData.name}</h3>
          <p className="text-sm opacity-90">{weatherData.weather?.[0]?.description}</p>
        </div>
        <div className="text-right">
          {getWeatherIcon(weatherData.weather?.[0]?.main)}
        </div>
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <div className="text-3xl font-bold mb-1">
          {Math.round(weatherData.main?.temp)}°C
        </div>
        <div className="text-sm opacity-90">
          Feels like {Math.round(weatherData.main?.feels_like)}°C
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Droplets size={16} />
          <span>{weatherData.main?.humidity}% Humidity</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind size={16} />
          <span>{weatherData.wind?.speed} m/s</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye size={16} />
          <span>{(weatherData.visibility / 1000).toFixed(1)} km</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity size={16} />
          <span>{weatherData.main?.pressure} hPa</span>
        </div>
      </div>

      {/* Forecast (if enabled) */}
      {showForecast && forecastData && (
        <div className="mt-6 pt-4 border-t border-white border-opacity-30">
          <h4 className="text-sm font-semibold mb-3">5-Day Forecast</h4>
          <div className="space-y-2">
            {forecastData.list?.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="opacity-90">
                  {new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}
                </span>
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(item.weather?.[0]?.main, 16)}
                  <span>{Math.round(item.main?.temp)}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-30">
        <button
          onClick={handleRefresh}
          className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium"
        >
          Refresh Weather
        </button>
      </div>

      {/* Last Updated */}
      <div className="mt-2 text-xs opacity-75 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default DynamicWeatherWidget;
