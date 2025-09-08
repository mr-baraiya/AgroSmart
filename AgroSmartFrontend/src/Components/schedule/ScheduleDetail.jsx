import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, CheckCircle, XCircle } from "lucide-react";
import { scheduleService } from "../../services";
import CustomAlert from "../common/CustomAlert";

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom Alert states
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  useEffect(() => {
    fetchSchedule();
  }, [id]);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await scheduleService.getById(id);
      setSchedule(response.data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError("Failed to fetch schedule details");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      showCancel
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const handleEdit = () => {
    navigate(`/dashboard/schedules/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${schedule.title}"?`)) {
      scheduleService.delete(id)
        .then(() => {
          navigate('/dashboard/schedules', { 
            state: { 
              message: `Schedule "${schedule.title}" deleted successfully!`,
              type: 'success'
            }
          });
        })
        .catch((err) => {
          console.error("Error deleting schedule:", err);
          alert("Failed to delete schedule. Please try again.");
        });
    }
  };

  const handleBack = () => {
    navigate('/dashboard/schedules');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Loading schedule details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Schedules
          </button>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Schedule not found.</p>
          <button
            onClick={handleBack}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Schedules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schedules
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{schedule.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-sm ${
                schedule.priority === 'High' ? 'bg-red-100 text-red-800' :
                schedule.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {schedule.priority} Priority
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                schedule.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {schedule.isCompleted ? 'Completed' : schedule.status}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Schedule Details</h3>
            
            {schedule.description && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{schedule.description}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <p className="text-gray-900">{formatDate(schedule.startDate)}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <p className="text-gray-900">{formatDate(schedule.endDate)}</p>
            </div>
            
            {schedule.type && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <p className="text-gray-900">{schedule.type}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            
            {schedule.fieldName && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                <p className="text-gray-900">{schedule.fieldName}</p>
              </div>
            )}
            
            {schedule.assignedTo && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <p className="text-gray-900">{schedule.assignedTo}</p>
              </div>
            )}
            
            {schedule.estimatedCost && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                <p className="text-gray-900">${schedule.estimatedCost}</p>
              </div>
            )}
            
            {schedule.notes && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-900">{schedule.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
