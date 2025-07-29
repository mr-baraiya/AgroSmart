import React from "react";
import FarmTableRow from "./FarmTableRow";

const FarmTable = ({
  farms,
  onEdit,
  onDelete,
  onInfo,
  onViewFields
}) => {
  // Ensure farms is always an array
  const farmsArray = Array.isArray(farms) ? farms : [];
  
  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Farm Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Location
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Acres
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Coordinates
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Active?
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
          />
        ))}
        {farmsArray.length === 0 && (
          <tr>
            <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
              No farms found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default FarmTable;
