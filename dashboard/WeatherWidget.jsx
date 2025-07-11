import React from 'react';

const WeatherWidget = ({ weather }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Weather Forecast
      </h3>
      
      {/* Current Weather */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current</p>
            <p className="text-2xl font-bold text-gray-900">
              {weather.current.temp}°C
            </p>
            <p className="text-sm text-gray-600">
              {weather.current.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Humidity: {weather.current.humidity}%
            </p>
            <p className="text-sm text-gray-600">
              Wind: {weather.current.wind} km/h
            </p>
            <p className="text-sm text-gray-600">
              Pressure: {weather.current.pressure} hPa
            </p>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="space-y-3">
        {weather.forecast.map((day, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <day.icon className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">{day.date}</p>
                <p className="text-sm text-gray-600">{day.desc}</p>
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {day.temp}°C
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;