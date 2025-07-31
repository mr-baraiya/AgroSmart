import React, { useEffect, useRef } from "react";
import { Edit, Trash2, Eye, MapPin } from "lucide-react";

const FarmActionsDropdown = ({ farm, onEdit, onDelete, onInfo, onViewFields, onClose }) => {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
        style={{ zIndex: 1000 }}
      >
        <div className="py-1">
          <button
            onClick={() => handleAction(onInfo)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Eye className="w-5 h-5 mr-2" />
            View Details
          </button>
          <button
            onClick={() => handleAction(onViewFields)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <MapPin className="w-5 h-5 mr-2" />
            View Fields
          </button>
          <button
            onClick={() => handleAction(onEdit)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Farm
          </button>
          <hr className="my-1" />
          <button
            onClick={() => handleAction(onDelete)}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Farm
          </button>
        </div>
      </div>
    </>
  );
};

export default FarmActionsDropdown;
