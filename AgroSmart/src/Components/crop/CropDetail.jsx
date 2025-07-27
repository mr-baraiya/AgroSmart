import React from "react";

const CropDetailModal = ({ open, onClose, crop }) => {
  if (!open || !crop) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl relative transform transition-all">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-gray-800">
          {crop.cropName}
          {crop.isActive && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          )}
        </h2>
        <p className="mb-6 text-gray-600 italic">{crop.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex justify-between border-b pb-2">
            <strong className="text-gray-500">Soil pH:</strong>
            <span className="text-gray-800">{crop.optimalSoilpHmin} - {crop.optimalSoilpHmax}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <strong className="text-gray-500">Temperature (°C):</strong>
            <span className="text-gray-800">{crop.optimalTempMin} - {crop.optimalTempMax}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <strong className="text-gray-500">Water (mm):</strong>
            <span className="text-gray-800">{crop.avgWaterReqmm}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <strong className="text-gray-500">Growth (days):</strong>
            <span className="text-gray-800">{crop.growthDurationDays}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <strong className="text-gray-500">Seeding Depth (cm):</strong>
            <span className="text-gray-800">{crop.seedingDepthCm}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <strong className="text-gray-500">Harvest Season:</strong>
            <span className="text-gray-800">{crop.harvestSeason}</span>
          </div>
          <div className="flex justify-between border-b pb-2 mt-4 col-span-1 md:col-span-2">
            <strong className="text-gray-500">Created At:</strong>
            <span className="text-gray-800">{crop.createdAt ? new Date(crop.createdAt).toLocaleDateString() : "—"}</span>
          </div>
          <div className="flex justify-between border-b pb-2 col-span-1 md:col-span-2">
            <strong className="text-gray-500">Updated At:</strong>
            <span className="text-gray-800">{crop.updatedAt ? new Date(crop.updatedAt).toLocaleDateString() : "—"}</span>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
            <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default CropDetailModal;