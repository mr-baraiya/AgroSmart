import React from "react";
import CropTableRow from "./CropTableRow";

const CropTable = ({
  crops,
  onEdit,
  onDelete,
  onInfo
}) => (
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Crop Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Description
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Soil pH
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Temp (°C)
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Water (mm)
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Season
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Active?
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {crops.map((crop) => (
        <CropTableRow
          key={crop.cropId}
          crop={crop}
          onEdit={() => onEdit(crop)}
          onDelete={() => onDelete(crop)}
          onInfo={() => onInfo(crop)}
        />
      ))}
      {crops.length === 0 && (
        <tr>
          <td colSpan={8} className="px-6 py-4 text-center text-gray-400">
            No crops found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default CropTable;