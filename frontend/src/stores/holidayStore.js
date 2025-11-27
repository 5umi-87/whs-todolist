import { create } from 'zustand';
import { axiosInstance } from '../services/api';

const useHolidayStore = create((set, get) => ({
  holidays: [],
  loading: false,
  error: null,

  fetchHolidays: async (year = new Date().getFullYear()) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/holidays?year=${year}`);
      const { data } = response;
      
      set({ 
        holidays: data.data,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.error?.message || '국경일 목록을 불러오는데 실패했습니다',
        loading: false 
      });
    }
  },

  createHoliday: async (holidayData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post('/holidays', holidayData);
      const { data } = response;
      
      set((state) => ({
        holidays: [...state.holidays, data.data],
        loading: false
      }));
      
      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.error?.message || '국경일을 추가하는데 실패했습니다',
        loading: false 
      });
      
      return { success: false, error: error.response?.data?.error?.message || '국경일을 추가하는데 실패했습니다' };
    }
  },

  updateHoliday: async (id, holidayData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/holidays/${id}`, holidayData);
      const { data } = response;
      
      set((state) => ({
        holidays: state.holidays.map(holiday => 
          holiday.holidayId === id ? { ...holiday, ...data.data } : holiday
        ),
        loading: false
      }));
      
      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.error?.message || '국경일을 수정하는데 실패했습니다',
        loading: false 
      });
      
      return { success: false, error: error.response?.data?.error?.message || '국경일을 수정하는데 실패했습니다' };
    }
  },

  deleteHoliday: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/holidays/${id}`);
      
      set((state) => ({
        holidays: state.holidays.filter(holiday => holiday.holidayId !== id),
        loading: false
      }));
      
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.error?.message || '국경일을 삭제하는데 실패했습니다',
        loading: false 
      });
      
      return { success: false, error: error.response?.data?.error?.message || '국경일을 삭제하는데 실패했습니다' };
    }
  }
}));

export { useHolidayStore };