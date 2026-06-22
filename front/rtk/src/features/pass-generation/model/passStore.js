import { create } from 'zustand';
import { passAPI } from '../api/passAPI';

export const usePassStore = create((set) => ({
  passData: null,
  qrCode: null,
  isLoading: false,
  error: null,
  isPassActive: false,

  generatePass: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await passAPI.generatePass();
      set({
        passData: response,
        qrCode: response.qr_code,
        isLoading: false,
        isPassActive: true,
      });
      
      // Auto-deactivate after 5 minutes
      setTimeout(() => {
        set({ isPassActive: false, passData: null, qrCode: null });
      }, 5 * 60 * 1000);
      
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Ошибка генерации пропуска',
        isLoading: false,
      });
    }
  },

  deactivatePass: () => {
    set({
      passData: null,
      qrCode: null,
      isPassActive: false,
      error: null,
    });
  },

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));