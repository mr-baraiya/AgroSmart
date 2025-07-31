import React, { useEffect, useRef, useState } from "react";
import { Edit, Trash2, Info } from "lucide-react";

const CropActionsDropdown = ({ onEdit, onDelete, onInfo, onClose, buttonRef }) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ showAbove: false, shouldUseFixed: false });

  // Close dropdown when clicking outside and determine position
  useEffect(() => {
    // Check dropdown position relative to viewport
    const checkPosition = () => {
      if (buttonRef?.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dropdownHeight = 140; // Approximate height of dropdown
        
        // Check if we're in the top half of the viewport
        const isInTopHalf = buttonRect.top < windowHeight / 2;
        
        // For rows in top area, show dropdown below
        // For rows in bottom area, show dropdown above
        const showAbove = !isInTopHalf && (buttonRect.bottom + dropdownHeight > windowHeight);
        
        // Use fixed positioning for better z-index handling if needed
        const shouldUseFixed = buttonRect.top < 150; // If close to top
        
        setPosition({ showAbove, shouldUseFixed });
      }
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    window.addEventListener('scroll', checkPosition);
    
    return () => {
      window.removeEventListener('resize', checkPosition);
      window.removeEventListener('scroll', checkPosition);
    };
  }, [buttonRef]);

  const handleAction = (action) => {
    action();
    onClose(); // Close dropdown after action
  };

  return (
    <>
      {/* Backdrop to close dropdown */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown menu */}
      <div 
        ref={dropdownRef}
        className={`absolute right-0 w-32 bg-white rounded shadow-lg border py-1 ${
          position.showAbove ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
        style={{ 
          zIndex: 9999,
          position: position.shouldUseFixed ? 'fixed' : 'absolute',
          ...(position.shouldUseFixed && buttonRef?.current ? {
            top: buttonRef.current.getBoundingClientRect().bottom + 5,
            right: window.innerWidth - buttonRef.current.getBoundingClientRect().right,
          } : {})
        }}
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
        Details
      </button>
      </div>
    </>
  );
};

export default CropActionsDropdown;