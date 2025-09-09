import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Edit, Trash2, Info } from "lucide-react";

const CropActionsDropdown = ({ onEdit, onDelete, onInfo, onClose, buttonRef }) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, showAbove: false });

  // Close dropdown when clicking outside and calculate position
  useEffect(() => {
    const calculatePosition = () => {
      if (buttonRef?.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const dropdownHeight = 140; // Approximate height of dropdown
        const dropdownWidth = 128; // w-32 = 128px
        
        // Calculate if dropdown should appear above or below
        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const showAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
        
        // Calculate horizontal position (align to right of button)
        let left = buttonRect.right - dropdownWidth;
        
        // Ensure dropdown doesn't go off-screen horizontally
        if (left < 8) left = 8; // 8px padding from left edge
        if (left + dropdownWidth > windowWidth - 8) {
          left = windowWidth - dropdownWidth - 8; // 8px padding from right edge
        }
        
        // Calculate vertical position
        const top = showAbove 
          ? buttonRect.top - dropdownHeight - 5 
          : buttonRect.bottom + 5;
        
        setPosition({ top, left, showAbove });
      }
    };

    calculatePosition();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef?.current && !buttonRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [buttonRef, onClose]);

  const handleAction = (action) => {
    action();
    onClose(); // Close dropdown after action
  };

  // Render dropdown using portal to ensure it's not clipped by parent containers
  return createPortal(
    <div 
      ref={dropdownRef}
      className="fixed w-32 bg-white rounded shadow-lg border py-1"
      style={{ 
        top: position.top,
        left: position.left,
        zIndex: 9999,
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
    </div>,
    document.body
  );
};

export default CropActionsDropdown;