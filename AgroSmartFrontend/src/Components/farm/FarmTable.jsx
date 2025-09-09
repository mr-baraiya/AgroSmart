import React from "react";
import FarmTableRow from "./FarmTableRow";

const FarmTable = ({
  farms,
  onEdit,
  onDelete,
  onInfo,
  onViewFields,
  selectedFarms = [],
  onSelectFarm,
  onSelectAll
}) => {
  // Ensure farms is always an array
  const farmsArray = Array.isArray(farms) ? farms : [];
  
  const isAllSelected = farmsArray.length > 0 && farmsArray.every(farm => 
    selectedFarms.includes(farm.farmId || farm.id)
  );
  
  const isIndeterminate = farmsArray.some(farm => 
    selectedFarms.includes(farm.farmId || farm.id)
  ) && !isAllSelected;
  
  return (
    <div style={{ overflow: 'visible' }}>
      <table className="w-full" style={{ position: 'relative' }}>
      <thead className="bg-blue-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={checkbox => {
                if (checkbox) checkbox.indeterminate = isIndeterminate;
              }}
              onChange={onSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            Farm Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            Location
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            Total Acres
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            Coordinates
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            Active?
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {farmsArray.map((farm) => (
          <FarmTableRow
            key={farm.farmId}
            farm={farm}
            onEdit={() => onEdit(farm)}
            onDelete={() => onDelete(farm)}
            onInfo={() => onInfo(farm)}
            onViewFields={() => onViewFields(farm)}
            selected={selectedFarms.includes(farm.farmId || farm.id)}
            onSelect={() => onSelectFarm(farm.farmId || farm.id)}
          />
        ))}
        {farmsArray.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
              No farms found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export default FarmTable;
