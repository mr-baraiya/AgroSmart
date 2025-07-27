import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "@/config";
import CropModal from "./CropModal";
import CropTable from "./CropTable";
import CropDetailModal from "./CropDetail";

const API_URL = `${API_BASE_URL}/Crop/All`;

const CropsView = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the Add/Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [cropToEdit, setCropToEdit] = useState(null);

  // State for the Info modal
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [cropToShow, setCropToShow] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
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

  const handleEdit = (crop) => {
    setCropToEdit(crop);
    setShowEditModal(true);
  };

  const handleDelete = async (crop) => {
    if (window.confirm(`Delete crop "${crop.cropName}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/Crop/${crop.cropId}`);
        setCrops((prev) => prev.filter((c) => c.cropId !== crop.cropId));
      } catch {
        alert("Failed to delete crop");
      }
    }
  };

  // Show the info modal instead of navigating
  const handleInfo = (crop) => {
    setCropToShow(crop);
    setShowInfoModal(true);
  };

  return (
    <div className="p-6">
      {/* Add/Edit Modal */}
      <CropModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCropToEdit(null);
        }}
        onSaved={handleSaved}
        crop={cropToEdit}
      />

      {/* Info Modal */}
      <CropDetailModal
        open={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        crop={cropToShow}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crop Management</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setShowEditModal(true);
            setCropToEdit(null);
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