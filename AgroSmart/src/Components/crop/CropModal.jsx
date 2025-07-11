import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "@/config";

const CropModal = ({ open, onClose, onSaved, crop }) => {
  const isEdit = !!crop;
  const [form, setForm] = useState({
    cropName: "",
    optimalSoilpHmin: "",
    optimalSoilpHmax: "",
    optimalTempMin: "",
    optimalTempMax: "",
    avgWaterReqmm: "",
    growthDurationDays: "",
    seedingDepthCm: "",
    harvestSeason: "",
    description: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (crop) {
      setForm(crop);
    } else {
      setForm({
        cropName: "",
        optimalSoilpHmin: "",
        optimalSoilpHmax: "",
        optimalTempMin: "",
        optimalTempMax: "",
        avgWaterReqmm: "",
        growthDurationDays: "",
        seedingDepthCm: "",
        harvestSeason: "",
        description: "",
        isActive: true,
      });
    }
  }, [crop, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const payload = {
        ...form,
        optimalSoilpHmin: parseFloat(form.optimalSoilpHmin),
        optimalSoilpHmax: parseFloat(form.optimalSoilpHmax),
        optimalTempMin: parseFloat(form.optimalTempMin),
        optimalTempMax: parseFloat(form.optimalTempMax),
        avgWaterReqmm: parseFloat(form.avgWaterReqmm),
        growthDurationDays: parseInt(form.growthDurationDays),
        seedingDepthCm: parseFloat(form.seedingDepthCm),
      };
      let res;
      if (isEdit) {
        res = await axios.put(`${API_BASE_URL}/Crop/${crop.cropId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/Crop`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
      onSaved(res.data, isEdit);
      onClose();
    } catch (error) {
      setErr("Failed to save crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form className="bg-white p-6 rounded shadow-lg w-full max-w-xl"
        onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isEdit ? "Edit Crop" : "Add Crop"}</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl">&times;</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="cropName" required value={form.cropName} onChange={handleChange} className="border p-2 rounded" placeholder="Crop Name" />
          <input name="harvestSeason" value={form.harvestSeason} onChange={handleChange} className="border p-2 rounded" placeholder="Harvest Season" />
          <input name="optimalSoilpHmin" type="number" step="0.1" value={form.optimalSoilpHmin} onChange={handleChange} className="border p-2 rounded" placeholder="Soil pH Min" />
          <input name="optimalSoilpHmax" type="number" step="0.1" value={form.optimalSoilpHmax} onChange={handleChange} className="border p-2 rounded" placeholder="Soil pH Max" />
          <input name="optimalTempMin" type="number" value={form.optimalTempMin} onChange={handleChange} className="border p-2 rounded" placeholder="Temp Min °C" />
          <input name="optimalTempMax" type="number" value={form.optimalTempMax} onChange={handleChange} className="border p-2 rounded" placeholder="Temp Max °C" />
          <input name="avgWaterReqmm" type="number" value={form.avgWaterReqmm} onChange={handleChange} className="border p-2 rounded" placeholder="Water req. (mm)" />
          <input name="growthDurationDays" type="number" value={form.growthDurationDays} onChange={handleChange} className="border p-2 rounded" placeholder="Duration (days)" />
          <input name="seedingDepthCm" type="number" step="0.1" value={form.seedingDepthCm} onChange={handleChange} className="border p-2 rounded" placeholder="Seeding Depth (cm)" />
          <input name="description" value={form.description} onChange={handleChange} className="border p-2 rounded md:col-span-2" placeholder="Description" />
          <label className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
            Active
          </label>
        </div>
        {err && <div className="text-red-500 my-2">{err}</div>}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {loading ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save Changes" : "Add Crop")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CropModal;