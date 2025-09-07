import React, { useState } from 'react';
import { realTimeWeatherService } from '../../services/realTimeWeatherService';

const WeatherAPITest = () => {
  const [testResults, setTestResults] = useState('');
  const [loading, setLoading] = useState(false);

  const runAPITest = async () => {
    setLoading(true);
    setTestResults('🌤️ Testing OpenWeatherMap API...\n');

    try {
      // Test Rajkot weather (default city)
      setTestResults(prev => prev + '\n📍 Testing Current Weather for Rajkot...\n');
      const rajkotWeather = await realTimeWeatherService.getCurrentWeatherByCity('Rajkot');
      
      const rajkotResult = `✅ Rajkot Weather:
        City: ${rajkotWeather.name}
        Temperature: ${rajkotWeather.main.temp}°C
        Condition: ${rajkotWeather.weather[0].description}
        Humidity: ${rajkotWeather.main.humidity}%
        Wind Speed: ${rajkotWeather.wind.speed} m/s
        Pressure: ${rajkotWeather.main.pressure} hPa\n`;
      
      setTestResults(prev => prev + rajkotResult);

      // Test Delhi weather
      setTestResults(prev => prev + '\n📍 Testing Current Weather for Delhi...\n');
      const delhiWeather = await realTimeWeatherService.getCurrentWeatherByCity('Delhi');
      
      const delhiResult = `✅ Delhi Weather:
        City: ${delhiWeather.name}
        Temperature: ${delhiWeather.main.temp}°C
        Condition: ${delhiWeather.weather[0].description}
        Humidity: ${delhiWeather.main.humidity}%
        Wind Speed: ${delhiWeather.wind.speed} m/s\n`;
      
      setTestResults(prev => prev + delhiResult);

      // Test forecast for Rajkot
      setTestResults(prev => prev + '\n📅 Testing 5-Day Forecast for Rajkot...\n');
      const rajkotForecast = await realTimeWeatherService.getForecastByCity('Rajkot');
      
      const forecastResult = `✅ Rajkot Forecast:
        City: ${rajkotForecast.city.name}
        Forecast Count: ${rajkotForecast.list.length} entries
        First Forecast: ${new Date(rajkotForecast.list[0].dt * 1000).toLocaleString()}
        Temperature: ${rajkotForecast.list[0].main.temp}°C
        Condition: ${rajkotForecast.list[0].weather[0].description}\n`;
      
      setTestResults(prev => prev + forecastResult);

      setTestResults(prev => prev + '\n🎉 All API tests passed! Your weather integration is working correctly.\n');
      
    } catch (error) {
      console.error('API Test Error:', error);
      
      let errorMessage = '❌ API Test Failed: ' + error.message + '\n';
      
      if (error.response) {
        errorMessage += `Status: ${error.response.status}\n`;
        
        if (error.response.status === 401) {
          errorMessage += '🔑 Invalid API Key - Please check your VITE_WEATHER_API_KEY\n';
        } else if (error.response.status === 404) {
          errorMessage += '🌍 City not found - Please check city name spelling\n';
        } else if (error.response.status === 429) {
          errorMessage += '⏰ API rate limit exceeded - Please wait and try again\n';
        }
      }
      
      setTestResults(prev => prev + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Weather API Test</h2>
      
      <div className="mb-6">
        <button
          onClick={runAPITest}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {loading ? 'Testing API...' : 'Test Weather API'}
        </button>
      </div>

      {testResults && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Test Results:</h3>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
            {testResults}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">API Endpoints Being Tested:</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Rajkot Current Weather:</strong> https://api.openweathermap.org/data/2.5/weather?q=Rajkot&appid=YOUR_KEY&units=metric</p>
          <p><strong>Delhi Current Weather:</strong> https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=YOUR_KEY&units=metric</p>
          <p><strong>Rajkot 5-Day Forecast:</strong> https://api.openweathermap.org/data/2.5/forecast?q=Rajkot&appid=YOUR_KEY&units=metric</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAPITest;
