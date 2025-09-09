import React from "react";
import { Sprout, Eye, Edit, Trash2 } from "lucide-react";

const CropTableRow = ({
  crop,
  onEdit,
  onDelete,
  onInfo,
  isSelected = false,
  onSelect
}) => {

  return (
    <tr className="hover:bg-gray-50" style={{ position: 'relative' }}>
      {onSelect && (
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
        </td>
      )}
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={onInfo}
            className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
            title="Edit Crop"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition-colors"
            title="Delete Crop"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CropTableRow;