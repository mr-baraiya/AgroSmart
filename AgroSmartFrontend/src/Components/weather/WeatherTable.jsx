import React from "react";
import WeatherTableRow from "./WeatherTableRow";
import { Cloud, Thermometer, Droplets, Wind, MapPin, Calendar } from "lucide-react";

const WeatherTable = ({ weatherData, onEdit, onDelete, onInfo }) => {
  if (!weatherData || weatherData.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Cloud className="w-20 h-20 text-sky-300" />
          <h3 className="text-xl font-semibold text-sky-700">No Weather Data Found</h3>
          <p className="text-sky-600">Start by adding some weather records to track conditions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temperature
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Humidity
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Wind Speed
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Description
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Forecast Date
              </div>
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-sky-100">
          {weatherData.map((weather, index) => (
            <WeatherTableRow
              key={weather.weatherId}
              weather={weather}
              onEdit={onEdit}
              onDelete={onDelete}
              onInfo={onInfo}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherTable;
