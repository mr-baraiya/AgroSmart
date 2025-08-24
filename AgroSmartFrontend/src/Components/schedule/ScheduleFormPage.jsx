import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Clock, Target, FileText, DollarSign } from "lucide-react";
import { scheduleService, fieldService } from "../../services";
import Swal from 'sweetalert2';

const ScheduleFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    fieldId: "",
    scheduleType: "",
    title: "",
    description: "",
    scheduledDate: "",
    duration: "",
    estimatedCost: "",
    priority: "medium",
    status: "pending",
    isCompleted: false
  });

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Schedule type options
  const scheduleTypes = [
    { value: "planting", label: "Planting" },
    { value: "watering", label: "Watering" },
    { value: "fertilizing", label: "Fertilizing" },
    { value: "harvesting", label: "Harvesting" },
    { value: "maintenance", label: "Maintenance" },
    { value: "inspection", label: "Inspection" },
    { value: "pest_control", label: "Pest Control" },
    { value: "pruning", label: "Pruning" },
    { value: "general", label: "General Task" }
  ];

  // Priority options
  const priorities = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  // Status options
  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "delayed", label: "Delayed" }
  ];

  useEffect(() => {
    loadFields();
    if (isEdit) {
      fetchScheduleData();
    } else {
      // Set default scheduled date to current time for new records
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        scheduledDate: now.toISOString().slice(0, 16) // Format for datetime-local input
      }));
    }
  }, [id, isEdit]);

  const loadFields = async () => {
    try {
      const response = await fieldService.getAll();
      const fieldsData = Array.isArray(response.data) ? response.data : [];
      setFields(fieldsData);
    } catch (error) {
      console.error("Error loading fields:", error);
    }
  };

  const fetchScheduleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await scheduleService.getById(id);
      const schedule = response.data;
      
      setFormData({
        fieldId: schedule.fieldId || "",
        scheduleType: schedule.scheduleType || "",
        title: schedule.title || "",
        description: schedule.description || "",
        scheduledDate: schedule.scheduledDate ? 
          new Date(schedule.scheduledDate).toISOString().slice(0, 16) : "",
        duration: schedule.duration || "",
        estimatedCost: schedule.estimatedCost || "",
        priority: schedule.priority || "medium",
        status: schedule.status || "pending",
        isCompleted: schedule.isCompleted || false
      });
    } catch (err) {
      console.error("Error fetching schedule data:", err);
      setError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const scheduleData = {
        ...formData,
        fieldId: parseInt(formData.fieldId) || null,
        duration: parseFloat(formData.duration) || 0,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        createdAt: isEdit ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEdit) {
        await scheduleService.update(id, scheduleData);
        
        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Schedule Updated!',
          text: `Schedule "${formData.title}" has been updated successfully.`,
          confirmButtonText: 'Continue',
          confirmButtonColor: '#10b981',
          customClass: {
            confirmButton: 'swal2-confirm-button'
          }
        });
        
        navigate("/schedules");
      } else {
        await scheduleService.create(scheduleData);
        
        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Schedule Created!',
          text: `Schedule "${formData.title}" has been created successfully.`,
          confirmButtonText: 'Continue',
          confirmButtonColor: '#10b981',
          customClass: {
            confirmButton: 'swal2-confirm-button'
          }
        });
        
        navigate("/schedules");
      }
    } catch (err) {
      console.error("Error saving schedule:", err);
      
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: `Failed to ${isEdit ? 'Update' : 'Create'} Schedule`,
        text: err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} schedule. Please try again.`,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-button'
        }
      });
      
      setError(`Failed to ${isEdit ? 'update' : 'create'} schedule`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/schedules");
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 to-orange-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <span className="text-purple-600 font-medium">Loading schedule data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-orange-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="p-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent">
            {isEdit ? 'Edit Schedule' : 'Add Schedule'}
          </h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-800 rounded-xl">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Row 1: Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-800 flex items-center gap-2 border-b border-purple-200 pb-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Water tomato plants"
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700">
                    Field
                  </label>
                  <select
                    name="fieldId"
                    value={formData.fieldId}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="">Select Field</option>
                    {fields.map(field => (
                      <option key={field.fieldId} value={field.fieldId}>
                        {field.fieldName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-purple-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detailed description of the task..."
                  className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Row 2: Schedule Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-800 flex items-center gap-2 border-b border-purple-200 pb-2">
                <Calendar className="w-5 h-5" />
                Schedule Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700">
                    Schedule Type *
                  </label>
                  <select
                    name="scheduleType"
                    value={formData.scheduleType}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="">Select Type</option>
                    {scheduleTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="0"
                    step="15"
                    placeholder="e.g., 60"
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Priority and Status */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-800 flex items-center gap-2 border-b border-purple-200 pb-2">
                <Target className="w-5 h-5" />
                Priority & Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700">
                    Priority Level *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Estimated Cost
                  </label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g., 25.00"
                    className="w-full p-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isCompleted"
                  checked={formData.isCompleted}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500"
                />
                <label className="text-sm font-semibold text-purple-700">
                  Mark as completed
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-purple-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-xl hover:from-purple-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : (isEdit ? 'Update Schedule' : 'Create Schedule')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFormPage;
