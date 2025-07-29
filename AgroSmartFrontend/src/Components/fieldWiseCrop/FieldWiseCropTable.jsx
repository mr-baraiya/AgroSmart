import React from "react";
import FieldWiseCropTableRow from "./FieldWiseCropTableRow";

const FieldWiseCropTable = ({ fieldCrops, onEdit, onDelete, onInfo }) => {
  if (!fieldCrops || fieldCrops.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg mb-2">No crop assignments found</p>
        <p className="text-sm">Try adjusting your filters or plant a crop in a field to get started.</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
            Crop
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
            Field
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
            Farm
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
            Planting Date
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
            Expected Harvest
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
            Status
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {fieldCrops.map((fieldCrop, index) => (
          <FieldWiseCropTableRow
            key={fieldCrop.fieldWiseCropId || index}
            fieldCrop={fieldCrop}
            onEdit={onEdit}
            onDelete={onDelete}
            onInfo={onInfo}
          />
        ))}
      </tbody>
    </table>
  );
};

export default FieldWiseCropTable;
