import React from "react";
import { Sun, CloudRain, Thermometer, Leaf, Droplet } from "lucide-react";
import FarmsView from "../farm/FarmsView";
import CropsView from "../crop/CropsView";
import StatsCard from "./StatsCard";

const Content = ({ activeTab }) => {
  return (
    <div className="p-6 space-y-6">
      {activeTab === "dashboard" && (
        <>
          <h1 className="text-2xl font-bold text-green-800">
            Welcome to AgroSmart Dashboard 🌿
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Farms"
              value="12"
              unit=""
              icon={Leaf}
              color="bg-green-500"
              trend="5"
            />
            <StatsCard
              title="Active Sensors"
              value="38"
              unit=""
              icon={Thermometer}
              color="bg-yellow-500"
              trend="8"
            />
            <StatsCard
              title="Avg. Moisture"
              value="42"
              unit="%"
              icon={Droplet}
              color="bg-blue-500"
              trend="2"
            />
            <StatsCard
              title="Rain Forecast"
              value="Yes"
              unit="🌧️"
              icon={CloudRain}
              color="bg-purple-500"
            />
          </div>

          <div className="bg-white rounded-2xl shadow p-6 space-y-2">
            <div className="flex items-center space-x-4">
              <Sun className="text-orange-500 w-8 h-8" />
              <div>
                <p className="text-gray-500 text-sm">Today’s Weather</p>
                <p className="text-xl font-semibold">32°C, Sunny</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Recent Sensor Readings
            </h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="text-gray-500 border-b">
                  <tr>
                    <th className="p-2">Sensor</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Value</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">Sensor #12</td>
                    <td className="p-2">Temperature</td>
                    <td className="p-2">31°C</td>
                    <td className="p-2">08:45 AM</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">Sensor #15</td>
                    <td className="p-2">Soil Moisture</td>
                    <td className="p-2">46%</td>
                    <td className="p-2">08:43 AM</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-2">Sensor #22</td>
                    <td className="p-2">Humidity</td>
                    <td className="p-2">72%</td>
                    <td className="p-2">08:40 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "farms" && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Farms Overview</h2>
          <FarmsView
            sampleData={{
              farms: [
                {
                  id: 1,
                  name: "Green Valley Farm",
                  location: "Uttar Pradesh",
                  acres: 120,
                  fields: 8,
                },
                {
                  id: 2,
                  name: "Sunrise Agro",
                  location: "Maharashtra",
                  acres: 85,
                  fields: 5,
                },
                {
                  id: 3,
                  name: "Riverdale Farm",
                  location: "Punjab",
                  acres: 150,
                  fields: 10,
                },
              ],
            }}
          />
        </div>
      )}

      {activeTab === "crops" && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Crops Overview</h2>
          <CropsView />
        </div>
      )}
    </div>
  );
};

export default Content;
