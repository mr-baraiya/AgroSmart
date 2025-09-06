import api from './api';

const API_BASE_URL = '/api/Schedule';

export const userScheduleService = {
  // Get all schedules for current user
  getAllUserSchedules: async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/All`);
      return response;
    } catch (error) {
      console.error('Error fetching user schedules:', error);
      throw error;
    }
  },

  // Get schedule by ID (with ownership validation)
  getScheduleById: async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching schedule by ID:', error);
      throw error;
    }
  },

  // Create new schedule for current user
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post(API_BASE_URL, scheduleData);
      return response;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  // Update schedule (with ownership validation)
  updateSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, scheduleData);
      return response;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  // Delete schedule (with ownership validation)
  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

  // Filter schedules for current user
  filterSchedules: async (filterParams = {}) => {
    try {
      const response = await api.get(`${API_BASE_URL}/Filter`, {
        params: filterParams
      });
      return response;
    } catch (error) {
      console.error('Error filtering schedules:', error);
      throw error;
    }
  }
};

export default userScheduleService;
