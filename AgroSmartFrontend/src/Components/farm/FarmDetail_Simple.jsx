import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { farmService } from "../../services";

const FarmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadFarmDetails();
    }
  }, [id]);

  const loadFarmDetails = async () => {
    setLoading(true);
    try {
      const response = await farmService.getById(id);
      setFarm(response.data);
    } catch (error) {
      console.error("Error loading farm details:", error);
      setError("Failed to load farm details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/farms/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${farm?.farmName}"?`)) {
      farmService.delete(id)
        .then(() => {
          navigate("/farms", {
            state: {
              message: `Farm "${farm?.farmName}" deleted successfully!`,
              type: 'success'
            }
          });
        })
        .catch((err) => {
          console.error("Error deleting farm:", err);
          alert("Failed to delete farm. Please try again.");
        });
    }
  };

  const handleBack = () => {
    navigate("/farms");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Loading farm details...</div>
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">{error || "Farm not found"}</div>
        <div className="text-center mt-4">
          <button
            onClick={handleBack}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Farms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Farms
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{farm.farmName}</h1>
            <p className="text-gray-600">{farm.location}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Farm Details</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
              <p className="text-gray-900">{farm.farmName}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <p className="text-gray-900">{farm.location || 'Not specified'}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Acres</label>
              <p className="text-gray-900">{farm.totalAcres ? `${farm.totalAcres} acres` : 'Not specified'}</p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
              <p className="text-gray-900">
                {farm.latitude && farm.longitude 
                  ? `${farm.latitude.toFixed(4)}, ${farm.longitude.toFixed(4)}`
                  : 'Not specified'
                }
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`px-2 py-1 rounded text-sm ${
                farm.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {farm.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {farm.description && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{farm.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetail;
