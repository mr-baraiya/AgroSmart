import api from './api';

const API_BASE_URL = '/api/Schedule';

export const adminScheduleService = {
  // Get all schedules (admin access)
  getAllSchedules: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching all schedules (admin):', error);
      throw error;
    }
  },

  // Get schedule by ID (admin access)
  getScheduleById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching schedule by ID (admin):', error);
      throw error;
    }
  },

  // Create new schedule (admin)
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post(API_BASE_URL, scheduleData);
      return response;
    } catch (error) {
      console.error('Error creating schedule (admin):', error);
      throw error;
    }
  },

  // Update schedule (admin access)
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, scheduleData);
      return response;
    } catch (error) {
      console.error('Error updating schedule (admin):', error);
      throw error;
    }
  },

  // Delete schedule (admin access)
  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting schedule (admin):', error);
      throw error;
    }
  },

  // Filter schedules (admin access)
  filterSchedules: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering schedules (admin):', error);
      throw error;
    }
  }
};

export default adminScheduleService;
