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
    setShowActions(prev => !prev);
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
        <div className="max-w-xs truncate" title={crop.description}>
          {crop.description || 'No description'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.optimalSoilpHmin && crop.optimalSoilpHmax 
          ? `${crop.optimalSoilpHmin} - ${crop.optimalSoilpHmax}`
          : 'Not specified'
        }
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.optimalTempMin && crop.optimalTempMax 
          ? `${crop.optimalTempMin}° - ${crop.optimalTempMax}°`
          : 'Not specified'
        }
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.avgWaterReqmm ? `${crop.avgWaterReqmm} mm` : 'Not specified'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {crop.harvestSeason || 'Not specified'}
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
            onEdit={onEdit}
            onDelete={onDelete}
            onInfo={onInfo}
            onClose={hideActions}
          />
        )}
      </td>
    </tr>
  );
};

export default CropTableRow;