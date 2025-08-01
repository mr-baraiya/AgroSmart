// src/config.js
// Use environment variables from .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7059/api";

// OpenWeatherMap API configuration
export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
export const WEATHER_API_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL;

export default API_BASE_URL;
