import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "@/config";
import CropModal from "./CropModal";
import CropTable from "./CropTable";

const API_URL = `${API_BASE_URL}/Crop/All`;

const CropsView = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActions, setShowActions] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editCrop, setEditCrop] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Accept: "application/json" }
        });
        setCrops(response.data);
      } catch (err) {
        setError("Failed to fetch crops");
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const handleSaved = (savedCrop, isEdit) => {
    if (isEdit) {
      setCrops((prev) =>
        prev.map((c) => (c.cropId === savedCrop.cropId ? savedCrop : c))
      );
    } else {
      setCrops((prev) => [...prev, savedCrop]);
    }
  };

  const handleMoreClick = (cropId) => {
    setShowActions((prev) => ({
      ...prev,
      [cropId]: !prev[cropId],
    }));
  };

  const handleEdit = (crop) => {
    setEditCrop(crop);
    setShowModal(true);
    setShowActions({});
  };

  const handleDelete = async (crop) => {
    if (window.confirm(`Delete crop "${crop.cropName}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/Crop/${crop.cropId}`);
        setCrops((prev) => prev.filter((c) => c.cropId !== crop.cropId));
      } catch {
        alert("Failed to delete crop");
      }
      setShowActions({});
    }
  };

  // Use React Router navigation for More Info
  const handleInfo = (crop) => {
    setShowActions({});
    navigate(`/crops/${crop.cropId}`);
  };

  return (
    <div className="p-6">
      <CropModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditCrop(null);
        }}
        onSaved={handleSaved}
        crop={editCrop}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crop Management</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setShowModal(true);
            setEditCrop(null);
          }}
        >
          <Plus className="w-4 h-4" />
          Plant Crop
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-gray-500 text-center">Loading crops...</div>
          ) : error ? (
            <div className="p-6 text-red-500 text-center">{error}</div>
          ) : (
            <CropTable
              crops={crops}
              showActions={showActions}
              onToggleActions={handleMoreClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInfo={handleInfo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CropsView;