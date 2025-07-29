import axios from 'axios';
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from '../config';

// Real-time weather service using OpenWeatherMap API
export const realTimeWeatherService = {
  // Fetch current weather by coordinates
  getCurrentWeatherByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather by coordinates:', error);
      throw error;
    }
  },

  // Fetch current weather by city name
  getCurrentWeatherByCity: async (cityName) => {
    try {
      const response = await axios.get(
        `${WEATHER_API_BASE_URL}/weather?q=${cityName}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather by city:', error);
      throw error;
    }
  },

  // Fetch 5-day forecast by coordinates
  getForecastByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${WEATHER_API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast by coordinates:', error);
      throw error;
    }
  },

  // Fetch 5-day forecast by city name
  getForecastByCity: async (cityName) => {
    try {
      const response = await axios.get(
        `${WEATHER_API_BASE_URL}/forecast?q=${cityName}&appid=${WEATHER_API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast by city:', error);
      throw error;
    }
  },

  // Convert OpenWeatherMap data to our application format
  convertToAppFormat: (weatherData) => {
    return {
      location: weatherData.name || `${weatherData.coord?.lat}, ${weatherData.coord?.lon}`,
      latitude: weatherData.coord?.lat || 0,
      longitude: weatherData.coord?.lon || 0,
      temperature: Math.round(weatherData.main?.temp || 0),
      humidity: weatherData.main?.humidity || 0,
      pressure: weatherData.main?.pressure || 0,
      windSpeed: Math.round((weatherData.wind?.speed || 0) * 10) / 10, // Round to 1 decimal
      weatherDescription: weatherData.weather?.[0]?.description || '',
      forecastDate: new Date().toISOString(),
      dataType: 'current',
      // Additional fields from API for reference
      feelsLike: Math.round(weatherData.main?.feels_like || 0),
      visibility: weatherData.visibility || 0,
      cloudiness: weatherData.clouds?.all || 0,
      seaLevelPressure: weatherData.main?.sea_level || weatherData.main?.pressure || 0,
      groundLevelPressure: weatherData.main?.grnd_level || weatherData.main?.pressure || 0,
      windDirection: weatherData.wind?.deg || 0,
      windGust: weatherData.wind?.gust || 0,
      rainVolume: weatherData.rain?.['1h'] || weatherData.rain?.['3h'] || 0,
      snowVolume: weatherData.snow?.['1h'] || weatherData.snow?.['3h'] || 0,
      sunrise: weatherData.sys?.sunrise ? new Date(weatherData.sys.sunrise * 1000).toISOString() : null,
      sunset: weatherData.sys?.sunset ? new Date(weatherData.sys.sunset * 1000).toISOString() : null,
      country: weatherData.sys?.country || '',
      timezone: weatherData.timezone || 0,
      cityId: weatherData.id || 0,
      icon: weatherData.weather?.[0]?.icon || '',
      mainWeather: weatherData.weather?.[0]?.main || '',
      weatherId: weatherData.weather?.[0]?.id || 0
    };
  },

  // Get user's current location (browser geolocation)
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
};

export default realTimeWeatherService;
