import React from "react";
import { Circle, Eye, Edit, Trash2, Sprout } from "lucide-react";

const FieldTableRow = ({ field, onEdit, onDelete, onInfo, onViewCrops }) => {
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-red-600';
      case 'maintenance':
        return 'text-yellow-600';
      case 'fallow':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  // Helper function to get irrigation type display
  const getIrrigationType = (type) => {
    if (!type) return 'Not specified';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Helper function to get field type display
  const getFieldType = (type) => {
    if (!type) return 'Not specified';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Helper function to get soil type display
  const getSoilType = (soil) => {
    if (!soil) return 'Not specified';
    return soil.charAt(0).toUpperCase() + soil.slice(1).toLowerCase();
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 text-sm">
        <div className="font-medium text-gray-900">
          {field.fieldName || 'Unnamed Field'}
        </div>
        {field.description && (
          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
            {field.description}
          </div>
        )}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {field.farmName || field.farm?.farmName || 'Not assigned'}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {getFieldType(field.fieldType)}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {field.areaInAcres ? Number(field.areaInAcres).toFixed(2) : '0.00'}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {getSoilType(field.soilType)}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {getIrrigationType(field.irrigationType)}
      </td>
      
      <td className="py-4 px-6 text-sm">
        <div className={`flex items-center gap-1 ${getStatusColor(field.status)}`}>
          <Circle className="w-2 h-2 fill-current" />
          <span className="capitalize">
            {field.status || 'Unknown'}
          </span>
        </div>
      </td>
      
      <td className="py-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onInfo(field)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(field)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Edit Field"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onViewCrops(field)}
            className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
            title="View Crops"
          >
            <Sprout className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(field)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Delete Field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FieldTableRow;
