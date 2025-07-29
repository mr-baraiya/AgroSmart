import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Sprout } from 'lucide-react';

const FieldActionsDropdown = ({ field, onEdit, onDelete, onInfo, onViewCrops }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    onEdit(field);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete(field);
    setIsOpen(false);
  };

  const handleInfo = () => {
    onInfo(field);
    setIsOpen(false);
  };

  const handleViewCrops = () => {
    onViewCrops(field);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={handleInfo}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Field
              </button>
              
              <button
                onClick={handleViewCrops}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Sprout className="w-4 h-4" />
                View Crops
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Field
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FieldActionsDropdown;
