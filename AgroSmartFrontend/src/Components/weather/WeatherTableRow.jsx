import React from "react";
import { Eye, Edit, Trash2, Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";

const WeatherTableRow = ({ weather, onEdit, onDelete, onInfo, index }) => {
  // Get weather icon based on description
  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('rain') || desc.includes('storm') || desc.includes('shower')) {
      return <CloudRain className="w-5 h-5 text-blue-600" />;
    }
    if (desc.includes('snow') || desc.includes('blizzard')) {
      return <CloudSnow className="w-5 h-5 text-blue-300" />;
    }
    if (desc.includes('cloud') || desc.includes('overcast')) {
      return <Cloud className="w-5 h-5 text-gray-500" />;
    }
    if (desc.includes('wind')) {
      return <Wind className="w-5 h-5 text-gray-600" />;
    }
    return <Sun className="w-5 h-5 text-yellow-500" />;
  };

  // Get temperature color based on value
  const getTemperatureColor = (temp) => {
    if (temp >= 30) return 'text-red-600 font-semibold';
    if (temp >= 20) return 'text-orange-600 font-semibold';
    if (temp >= 10) return 'text-yellow-600 font-semibold';
    if (temp >= 0) return 'text-blue-600 font-semibold';
    return 'text-blue-800 font-semibold';
  };

  // Get humidity color based on value
  const getHumidityColor = (humidity) => {
    if (humidity >= 80) return 'text-blue-700 font-semibold';
    if (humidity >= 60) return 'text-blue-600';
    if (humidity >= 40) return 'text-blue-500';
    return 'text-gray-600';
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Row background with alternating sky colors
  const rowBg = index % 2 === 0 ? 'bg-sky-25' : 'bg-white';

  return (
    <tr className={`${rowBg} hover:bg-sky-50 transition-colors duration-200 border-b border-sky-100`}>
      {/* Location */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-sky-900">{weather.location || 'Unknown'}</span>
          {weather.latitude && weather.longitude && (
            <span className="text-sm text-sky-600">
              {weather.latitude.toFixed(4)}, {weather.longitude.toFixed(4)}
            </span>
          )}
        </div>
      </td>

      {/* Temperature */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${getTemperatureColor(weather.temperature)}`}>
            {weather.temperature}°C
          </span>
        </div>
      </td>

      {/* Humidity */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={getHumidityColor(weather.humidity)}>
            {weather.humidity}%
          </span>
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(weather.humidity, 100)}%` }}
            ></div>
          </div>
        </div>
      </td>

      {/* Wind Speed */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700 font-medium">
            {weather.windSpeed} km/h
          </span>
        </div>
      </td>

      {/* Weather Description */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {getWeatherIcon(weather.weatherDescription)}
          <span className="text-gray-700 capitalize">
            {weather.weatherDescription || 'No description'}
          </span>
        </div>
      </td>

      {/* Forecast Date */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium">
            {formatDate(weather.forecastDate)}
          </span>
          {weather.dataType && (
            <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded-full inline-block w-fit mt-1">
              {weather.dataType}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onInfo(weather)}
            className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-lg transition-all duration-200 group"
            title="View Details"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={() => onEdit(weather)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 group"
            title="Edit Weather Data"
          >
            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={() => onDelete(weather)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 group"
            title="Delete Weather Data"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default WeatherTableRow;
