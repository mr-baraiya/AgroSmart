import React, { useState, useEffect } from 'react';
import { Cloud, MapPin, Thermometer, Wind, Eye, Droplets, Compass, Sun, CloudRain, RefreshCw } from 'lucide-react';
import { realTimeWeatherService } from '../../services/realTimeWeatherService';
import DynamicWeatherWidget from './DynamicWeatherWidget';

const WeatherDashboard = () => {
  const [currentLocation, setCurrentLocation] = useState('Rajkot');
  const [searchLocation, setSearchLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Popular cities for quick access (mostly Indian cities)
  const popularCities = [
    'Rajkot',
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Bhopal',
    'Visakhapatnam',
    'Patna',
    'Vadodara',
    'Ludhiana',
    'Agra',
    'Nashik',
    'Meerut',
    'Varanasi',
    'Ghaziabad'
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setCoordinates(coords);
          setCurrentLocation('Your Current Location');
          setSearchLocation('');
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your current location. Please enter a city name.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Handle location search
  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      setCurrentLocation(searchLocation.trim());
      setCoordinates(null);
      setError('');
    }
  };

  // Handle popular city selection
  const handleCitySelect = (city) => {
    setCurrentLocation(city);
    setSearchLocation(city);
    setCoordinates(null);
    setError('');
  };

  useEffect(() => {
    // Try to get current location on component mount
    getCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Weather Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Get real-time weather information for any location worldwide
          </p>
        </div>

        {/* Location Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Form */}
            <form onSubmit={handleLocationSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Enter city name (e.g., New York, London)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchLocation.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Current Location Button */}
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Compass className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Use My Location
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Popular Cities */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Cities:</h3>
            <div className="flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    currentLocation === city
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Location Display */}
        {currentLocation && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Weather for {currentLocation}
            </h2>
          </div>
        )}

        {/* Weather Widgets */}
        {(currentLocation || coordinates) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Weather */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                Current Weather
              </h3>
              <DynamicWeatherWidget 
                location={coordinates ? null : currentLocation}
                coordinates={coordinates}
                className="h-auto"
              />
            </div>

            {/* 5-Day Forecast */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-500" />
                5-Day Forecast
              </h3>
              <DynamicWeatherWidget 
                location={coordinates ? null : currentLocation}
                coordinates={coordinates}
                showForecast={true}
                className="h-auto"
              />
            </div>
          </div>
        )}

        {/* Weather Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" />
            Weather Tips for Farmers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Temperature</h4>
              <p className="text-sm text-blue-700">
                Monitor daily temperature fluctuations to protect sensitive crops from frost or heat stress.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Humidity</h4>
              <p className="text-sm text-green-700">
                High humidity can lead to fungal diseases. Ensure proper ventilation in greenhouses.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Wind Speed</h4>
              <p className="text-sm text-yellow-700">
                Strong winds can damage crops. Consider windbreaks for protection during storms.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Rainfall</h4>
              <p className="text-sm text-purple-700">
                Plan irrigation schedules based on precipitation forecasts to optimize water usage.
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Pressure</h4>
              <p className="text-sm text-red-700">
                Sudden pressure drops often indicate incoming storms. Prepare accordingly.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-2">Visibility</h4>
              <p className="text-sm text-indigo-700">
                Poor visibility may indicate fog or dust storms that can affect field operations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Weather data provided by OpenWeatherMap API</p>
          <p className="mt-1">Data is updated in real-time for accurate agricultural planning</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
