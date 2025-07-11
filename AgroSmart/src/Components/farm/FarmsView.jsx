import React from "react";
import { MapPin, Gauge, Sprout, Eye, Edit, Trash2, Plus } from "lucide-react";

const FarmsView = ({ sampleData }) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Farm Management</h2>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Farm
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleData.farms.map((farm) => (
        <div key={farm.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{farm.name}</h3>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{farm.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Gauge className="w-4 h-4" />
              <span className="text-sm">{farm.acres} acres</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Sprout className="w-4 h-4" />
              <span className="text-sm">{farm.fields} fields</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition-colors">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FarmsView;