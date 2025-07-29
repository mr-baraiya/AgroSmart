import React from "react";
import ScheduleTableRow from "./ScheduleTableRow";
import { Calendar, Clock, FileText, AlertTriangle, Target, CheckCircle2 } from "lucide-react";

const ScheduleTable = ({ schedules, onEdit, onDelete, onInfo }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Calendar className="w-20 h-20 text-green-300" />
          <h3 className="text-xl font-semibold text-green-700">No Schedules Found</h3>
          <p className="text-green-600">Start by creating your first schedule to organize your tasks.</p>
        </div>
      </div>
    );
  }

return (
    <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg bg-green-50">
            <thead>
                <tr className="bg-green-200">
                    <th className="px-4 py-3 text-left text-green-900 font-semibold">Title & Type</th>
                    <th className="px-4 py-3 text-left text-green-900 font-semibold">Scheduled Date</th>
                    <th className="px-4 py-3 text-left text-green-900 font-semibold">Duration</th>
                    <th className="px-4 py-3 text-left text-green-900 font-semibold">Priority</th>
                    <th className="px-4 py-3 text-left text-green-900 font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-green-900 font-semibold">Completion</th>
                    <th className="px-4 py-3 text-center text-green-900 font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {schedules.map((schedule, index) => (
                    <ScheduleTableRow
                        key={schedule.scheduleId}
                        schedule={schedule}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onInfo={onInfo}
                        index={index}
                    />
                ))}
            </tbody>
        </table>
    </div>
);
};

export default ScheduleTable;
