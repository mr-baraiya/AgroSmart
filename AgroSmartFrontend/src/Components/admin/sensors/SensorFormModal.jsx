import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, MapPin, Settings, Zap } from 'lucide-react';
import { sensorService } from '../../../services/sensorService';
import { adminFieldService } from '../../../services/adminFieldService';
import { toast } from 'react-toastify';

const SensorFormModal = ({ isOpen, onClose, sensor, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    sensorType: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    fieldId: '',
    installationDate: '',
    lastCalibrated: '',
    calibrationInterval: 90,
    latestValue: 0,
    latestUnit: '',
    latestQualityScore: 0.95,
    lastReadingTime: new Date().toISOString(),
    isActive: true
  });

  const sensorTypes = [
    { value: 'Temperature', label: 'Temperature', unit: '°C' },
    { value: 'Humidity', label: 'Humidity', unit: '%' },
    { value: 'Soil_Moisture', label: 'Soil Moisture', unit: '%' },
    { value: 'pH', label: 'pH Level', unit: 'pH' },
    { value: 'Light', label: 'Light Intensity', unit: 'Lux' },
    { value: 'Pressure', label: 'Atmospheric Pressure', unit: 'hPa' },
    { value: 'Wind', label: 'Wind Speed', unit: 'km/h' },
    { value: 'Rain', label: 'Rainfall', unit: 'mm' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadFields();
      if (sensor) {
        // Edit mode - populate form with sensor data
        setFormData({
          ...sensor,
          installationDate: sensor.installationDate ? new Date(sensor.installationDate).toISOString().split('T')[0] : '',
          lastCalibrated: sensor.lastCalibrated ? new Date(sensor.lastCalibrated).toISOString().split('T')[0] : '',
          lastReadingTime: sensor.lastReadingTime ? new Date(sensor.lastReadingTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
        });
      } else {
        // Add mode - reset form
        setFormData({
          sensorType: '',
          manufacturer: '',
          model: '',
          serialNumber: '',
          fieldId: '',
          installationDate: new Date().toISOString().split('T')[0],
          lastCalibrated: new Date().toISOString().split('T')[0],
          calibrationInterval: 90,
          latestValue: 0,
          latestUnit: '',
          latestQualityScore: 0.95,
          lastReadingTime: new Date().toISOString().slice(0, 16),
          isActive: true
        });
      }
    }
  }, [isOpen, sensor]);

  const loadFields = async () => {
    try {
      const response = await adminFieldService.getAllFields();
      setFields(response.data || response);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast.error('Failed to load fields');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Auto-set unit based on sensor type
    if (name === 'sensorType') {
      const sensorType = sensorTypes.find(st => st.value === value);
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        latestUnit: sensorType ? sensorType.unit : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        installationDate: new Date(formData.installationDate).toISOString(),
        lastCalibrated: new Date(formData.lastCalibrated).toISOString(),
        lastReadingTime: new Date(formData.lastReadingTime).toISOString(),
        fieldId: parseInt(formData.fieldId),
        calibrationInterval: parseInt(formData.calibrationInterval),
        latestValue: parseFloat(formData.latestValue),
        latestQualityScore: parseFloat(formData.latestQualityScore)
      };

      if (sensor) {
        // Update existing sensor
        await sensorService.update(sensor.sensorId, submitData);
        toast.success('Sensor updated successfully');
      } else {
        // Create new sensor
        await sensorService.create(submitData);
        toast.success('Sensor created successfully');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving sensor:', error);
      toast.error('Failed to save sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {sensor ? 'Edit Sensor' : 'Add New Sensor'}
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sensor Type *
                    </label>
                    <select
                      name="sensorType"
                      value={formData.sensorType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Sensor Type</option>
                      {sensorTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} ({type.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field *
                    </label>
                    <select
                      name="fieldId"
                      value={formData.fieldId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Field</option>
                      {fields.map(field => (
                        <option key={field.fieldId} value={field.fieldId}>
                          {field.fieldName} - {field.farmName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer *
                    </label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., AgroSense"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., T-100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., SN-T100-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      name="latestUnit"
                      value={formData.latestUnit}
                      onChange={handleInputChange}
                      placeholder="Auto-filled"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Installation & Calibration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Installation & Calibration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Installation Date *
                    </label>
                    <input
                      type="date"
                      name="installationDate"
                      value={formData.installationDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Calibrated *
                    </label>
                    <input
                      type="date"
                      name="lastCalibrated"
                      value={formData.lastCalibrated}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calibration Interval (days) *
                    </label>
                    <input
                      type="number"
                      name="calibrationInterval"
                      value={formData.calibrationInterval}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Current Reading */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Current Reading
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latest Value *
                    </label>
                    <input
                      type="number"
                      name="latestValue"
                      value={formData.latestValue}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality Score (0-1) *
                    </label>
                    <input
                      type="number"
                      name="latestQualityScore"
                      value={formData.latestQualityScore}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="1"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Reading Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="lastReadingTime"
                      value={formData.lastReadingTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Sensor is active
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {sensor ? 'Update Sensor' : 'Create Sensor'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SensorFormModal;
