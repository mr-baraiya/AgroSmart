// Test script to verify OpenWeatherMap API
import { realTimeWeatherService } from './services/realTimeWeatherService.js';

const testWeatherAPI = async () => {
  console.log('🌤️ Testing OpenWeatherMap API...');
  
  try {
    // Test current weather for Delhi
    console.log('\n📍 Testing Current Weather for Delhi:');
    const delhiWeather = await realTimeWeatherService.getCurrentWeatherByCity('Delhi');
    console.log('✅ Delhi Weather:', {
      city: delhiWeather.name,
      temperature: delhiWeather.main.temp + '°C',
      condition: delhiWeather.weather[0].description,
      humidity: delhiWeather.main.humidity + '%',
      windSpeed: delhiWeather.wind.speed + ' m/s'
    });

    // Test forecast for Delhi
    console.log('\n📅 Testing 5-Day Forecast for Delhi:');
    const delhiForecast = await realTimeWeatherService.getForecastByCity('Delhi');
    console.log('✅ Delhi Forecast:', {
      city: delhiForecast.city.name,
      forecastCount: delhiForecast.list.length,
      firstForecast: {
        time: new Date(delhiForecast.list[0].dt * 1000).toLocaleString(),
        temp: delhiForecast.list[0].main.temp + '°C',
        condition: delhiForecast.list[0].weather[0].description
      }
    });

    // Test current weather for London
    console.log('\n📍 Testing Current Weather for London:');
    const londonWeather = await realTimeWeatherService.getCurrentWeatherByCity('London');
    console.log('✅ London Weather:', {
      city: londonWeather.name,
      temperature: londonWeather.main.temp + '°C',
      condition: londonWeather.weather[0].description,
      humidity: londonWeather.main.humidity + '%',
      windSpeed: londonWeather.wind.speed + ' m/s'
    });

    console.log('\n🎉 All API tests passed! Your weather integration is working correctly.');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('🔑 Invalid API Key - Please check your VITE_WEATHER_API_KEY');
      } else if (error.response.status === 404) {
        console.error('🌍 City not found - Please check city name spelling');
      } else if (error.response.status === 429) {
        console.error('⏰ API rate limit exceeded - Please wait and try again');
      }
    }
  }
};

// Export for use in browser console
window.testWeatherAPI = testWeatherAPI;

console.log('🔧 Weather API test loaded. Run: testWeatherAPI() in console to test');
