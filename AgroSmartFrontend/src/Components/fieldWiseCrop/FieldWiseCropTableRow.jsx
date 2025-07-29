import React from "react";
import { Circle, Eye, Edit, Trash2 } from "lucide-react";

const FieldWiseCropTableRow = ({ fieldCrop, onEdit, onDelete, onInfo }) => {
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'planted':
        return 'text-green-600';
      case 'growing':
        return 'text-blue-600';
      case 'harvested':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate expected harvest date (assuming 90 days growth cycle if not provided)
  const calculateExpectedHarvest = (plantingDate, growthDays = 90) => {
    if (!plantingDate) return 'Not calculated';
    const plantDate = new Date(plantingDate);
    const harvestDate = new Date(plantDate.getTime() + (growthDays * 24 * 60 * 60 * 1000));
    return harvestDate.toLocaleDateString();
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 text-sm">
        <div className="font-medium text-gray-900">
          {fieldCrop.cropName || 'Unknown Crop'}
        </div>
        {fieldCrop.variety && (
          <div className="text-xs text-gray-500 mt-1">
            Variety: {fieldCrop.variety}
          </div>
        )}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {fieldCrop.fieldName || 'Unknown Field'}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {fieldCrop.farmName || 'Unknown Farm'}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {formatDate(fieldCrop.plantingDate)}
      </td>
      
      <td className="py-4 px-6 text-sm text-gray-600">
        {fieldCrop.expectedHarvestDate ? 
          formatDate(fieldCrop.expectedHarvestDate) : 
          calculateExpectedHarvest(fieldCrop.plantingDate)
        }
      </td>
      
      <td className="py-4 px-6 text-sm">
        <div className={`flex items-center gap-1 ${getStatusColor(fieldCrop.status)}`}>
          <Circle className="w-2 h-2 fill-current" />
          <span className="capitalize">
            {fieldCrop.status || 'Unknown'}
          </span>
        </div>
      </td>
      
      <td className="py-4 px-6 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onInfo(fieldCrop)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(fieldCrop)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Edit Assignment"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(fieldCrop)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Remove from Field"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FieldWiseCropTableRow;
