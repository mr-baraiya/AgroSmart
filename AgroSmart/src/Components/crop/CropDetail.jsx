import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "@/config";

const CropDetail = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Crop/${cropId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setCrop(data);
      } catch {
        setError("Failed to load crop details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [cropId]);

  if (loading) return <div className="p-6 text-center">Loading crop details...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!crop) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <button className="mb-4 text-blue-600" onClick={() => navigate(-1)}>&larr; Back</button>
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        {crop.cropName}
        {crop.isActive && (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
        )}
      </h2>
      <p className="mb-4 text-gray-700">{crop.description}</p>
      <div className="grid grid-cols-2 gap-2">
        <div><strong>Soil pH:</strong> {crop.optimalSoilpHmin} - {crop.optimalSoilpHmax}</div>
        <div><strong>Temperature (°C):</strong> {crop.optimalTempMin} - {crop.optimalTempMax}</div>
        <div><strong>Water (mm):</strong> {crop.avgWaterReqmm}</div>
        <div><strong>Growth Duration (days):</strong> {crop.growthDurationDays}</div>
        <div><strong>Seeding Depth (cm):</strong> {crop.seedingDepthCm}</div>
        <div><strong>Harvest Season:</strong> {crop.harvestSeason}</div>
        <div><strong>Created At:</strong> {crop.createdAt ? new Date(crop.createdAt).toLocaleDateString() : "—"}</div>
        <div><strong>Updated At:</strong> {crop.updatedAt ? new Date(crop.updatedAt).toLocaleDateString() : "—"}</div>
      </div>
    </div>
  );
};

export default CropDetail;