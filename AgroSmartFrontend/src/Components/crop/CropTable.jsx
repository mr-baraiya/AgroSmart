import React from "react";
import CropTableRow from "./CropTableRow";

const CropTable = ({
  crops,
  onEdit,
  onDelete,
  onInfo,
  selectedCrops = [],
  onSelectCrop
}) => {
  // Ensure crops is always an array
  const cropsArray = Array.isArray(crops) ? crops : [];
  return (
    <table className="w-full">
    <thead className="bg-green-600">
      <tr>
        {onSelectCrop && (
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-12">
            Select
          </th>
        )}
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Crop Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Description
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Soil pH
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Temp (°C)
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Water (mm)
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Season
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Active?
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {cropsArray.map((crop) => (
        <CropTableRow
          key={crop.cropId}
          crop={crop}
          onEdit={() => onEdit(crop)}
          onDelete={() => onDelete(crop)}
          onInfo={() => onInfo(crop)}
          isSelected={selectedCrops.includes(crop.cropId)}
          onSelect={onSelectCrop ? (isSelected) => onSelectCrop(crop.cropId, isSelected) : undefined}
        />
      ))}
      {cropsArray.length === 0 && (
        <tr>
          <td colSpan={onSelectCrop ? 9 : 8} className="px-6 py-4 text-center text-gray-400">
            No crops found.
          </td>
        </tr>
      )}
    </tbody>
    </table>
  );
};

export default CropTable;