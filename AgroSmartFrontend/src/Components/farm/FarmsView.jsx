import React, { useState, useEffect } from "react";
import { MapPin, Gauge, Sprout, Eye, Edit, Trash2, Plus } from "lucide-react";
import { farmService } from "../../services";

const FarmsView = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await farmService.getAll();
      setFarms(response.data || []);
    } catch (err) {
      console.error("Error fetching farms:", err);
      setError("Failed to load farms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarm = async (farmId, farmName) => {
    if (window.confirm(`Are you sure you want to delete "${farmName}"?`)) {
      try {
        await farmService.delete(farmId);
        setFarms(farms.filter(farm => farm.id !== farmId));
        alert("Farm deleted successfully!");
      } catch (error) {
        console.error("Error deleting farm:", error);
        alert("Failed to delete farm. Please try again.");
      }
    }
  };

  const handleViewFarm = (farm) => {
    // TODO: Navigate to farm details page or open modal
    console.log("View farm:", farm);
    alert(`Viewing details for ${farm.name}`);
  };

  const handleEditFarm = (farm) => {
    // TODO: Open edit modal or navigate to edit page
    console.log("Edit farm:", farm);
    alert(`Edit functionality for ${farm.name} - Coming soon!`);
  };

  const handleAddFarm = () => {
    // TODO: Open add farm modal or navigate to add page
    console.log("Add new farm");
    alert("Add new farm functionality - Coming soon!");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Farm Management</h1>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add New Farm
          </button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading farms...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Farm Management</h1>
          <button 
            onClick={handleAddFarm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Farm
          </button>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Farm Management</h1>
        <button 
          onClick={handleAddFarm}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Farm
        </button>
      </div>

      {farms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Farms Found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first farm.</p>
          <button 
            onClick={handleAddFarm}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div key={farm.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{farm.name}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewFarm(farm)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditFarm(farm)}
                    className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                    title="Edit Farm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteFarm(farm.id, farm.name)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete Farm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{farm.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Gauge className="w-4 h-4" />
                  <span className="text-sm">{farm.area || 0} acres</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Sprout className="w-4 h-4" />
                  <span className="text-sm">{farm.fieldCount || 0} fields</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleViewFarm(farm)}
                  className="w-full bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition-colors font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmsView;