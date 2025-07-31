import React from "react";
import FieldTableRow from "./FieldTableRow";

const FieldTable = ({ fields, onEdit, onDelete, onInfo, onViewCrops }) => {
  if (!fields || fields.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg mb-2">No fields found</p>
        <p className="text-sm">Try adjusting your filters or add a new field to get started.</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-green-100 border-b border-gray-200">
        <tr>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Field Name
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Farm
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Type
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Area (acres)
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Soil Type
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Irrigation
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Status
          </th>
          <th className="text-left py-3 px-6 text-sm font-semibold text-green-800">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {fields.map((field, index) => (
          <FieldTableRow
            key={field.fieldId || index}
            field={field}
            onEdit={onEdit}
            onDelete={onDelete}
            onInfo={onInfo}
            onViewCrops={onViewCrops}
          />
        ))}
      </tbody>
    </table>
  );
};

export default FieldTable;
