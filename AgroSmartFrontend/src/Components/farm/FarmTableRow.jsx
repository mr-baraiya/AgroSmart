import React, { useState } from "react";
import { MapPin, MoreHorizontal } from "lucide-react";
import FarmActionsDropdown from "./FarmActionsDropdown";

const FarmTableRow = ({
  farm,
  onEdit,
  onDelete,
  onInfo,
  onViewFields
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
        <button
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          onClick={toggleActions}
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
        {showActions && (
          <FarmActionsDropdown
            farm={farm}
            onEdit={() => onEdit(farm)}
            onDelete={() => onDelete(farm)}
            onInfo={() => onInfo(farm)}
            onViewFields={() => onViewFields(farm)}
            onClose={hideActions}
          />
        )}
      </td>
    </tr>
  );
};

export default FarmTableRow;
