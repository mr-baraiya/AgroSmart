import React, { useEffect, useRef, useState } from "react";
import { Edit, Trash2, Info } from "lucide-react";

const CropActionsDropdown = ({ onEdit, onDelete, onInfo, onClose }) => {
  const dropdownRef = useRef(null);
  const [showAbove, setShowAbove] = useState(false);

  // Close dropdown when clicking outside and determine position
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Check if dropdown should show above
    const checkPosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dropdownHeight = 120; // Approximate height of dropdown
        
        // If there's not enough space below, show above
        setShowAbove(rect.bottom + dropdownHeight > windowHeight);
      }
    };

    checkPosition();
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', checkPosition);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkPosition);
    };
  }, [onClose]);

  const handleAction = (action) => {
    action();
    onClose(); // Close dropdown after action
  };

  return (
    <div 
      ref={dropdownRef}
      className={`absolute right-0 z-10 w-32 bg-white rounded shadow-lg border py-1 ${
        showAbove ? 'bottom-full mb-2' : 'top-full mt-2'
      }`}
    >
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
        onClick={() => handleAction(onEdit)}
      >
        <Edit className="w-4 h-4 text-gray-600" />
        Edit
      </button>
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
        onClick={() => handleAction(onDelete)}
      >
        <Trash2 className="w-4 h-4 text-gray-600" />
        Delete
      </button>
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
        onClick={() => handleAction(onInfo)}
      >
        <Info className="w-4 h-4 text-gray-600" />
        More Info
      </button>
    </div>
  );
};

export default CropActionsDropdown;