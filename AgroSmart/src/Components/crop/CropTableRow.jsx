import React, { useState } from "react";
import { Sprout, MoreHorizontal } from "lucide-react";
import CropActionsDropdown from "./CropActionsDropdown";

const CropTableRow = ({
  crop,
  onEdit,
  onDelete,
  onInfo
}) => {
  const [showActions, setShowActions] = useState(false);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const hideActions = () => {
    setShowActions(false);
  };

  return (
    <tr className="hover:bg-gray-50 relative">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Sprout className="w-5 h-5 text-green-500 mr-3" />
          <span className="font-medium text-gray-900">{crop.cropName}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.optimalSoilpHmin} - {crop.optimalSoilpHmax}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.optimalTempMin} - {crop.optimalTempMax}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.avgWaterReqmm}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.harvestSeason}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {crop.isActive ? (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Yes
          </span>
        ) : (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            No
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
        <button
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          onClick={toggleActions}
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
        {showActions && (
          <CropActionsDropdown
            onEdit={() => onEdit(crop)}
            onDelete={() => onDelete(crop)}
            onInfo={() => onInfo(crop)}
            onClose={hideActions}
          />
        )}
      </td>
    </tr>
  );
};

export default CropTableRow;