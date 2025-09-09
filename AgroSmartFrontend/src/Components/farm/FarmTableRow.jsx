import React from "react";
import { MapPin, Eye, Edit, Trash2, Grid } from "lucide-react";

const FarmTableRow = ({
  farm,
  onEdit,
  onDelete,
  onInfo,
  onViewFields,
  selected = false,
  onSelect
}) => {

  return (
    <tr className={`hover:bg-gray-50 relative ${selected ? 'bg-blue-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-green-500 mr-3" />
          <span className="font-medium text-gray-900">{farm.farmName}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="max-w-xs truncate" title={farm.location}>
          {farm.location || 'Not specified'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {farm.totalAcres ? `${farm.totalAcres} acres` : 'Not specified'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {farm.latitude && farm.longitude 
          ? `${farm.latitude.toFixed(4)}, ${farm.longitude.toFixed(4)}`
          : 'Not specified'
        }
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {farm.isActive ? (
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
            onClick={() => onInfo(farm)}
            className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewFields(farm)}
            className="p-1.5 rounded-full hover:bg-purple-100 text-purple-600 transition-colors"
            title="View Fields"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(farm)}
            className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
            title="Edit Farm"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(farm)}
            className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition-colors"
            title="Delete Farm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FarmTableRow;
