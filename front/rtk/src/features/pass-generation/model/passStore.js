import { create } from 'zustand';
import { PASS_TIMEOUT } from '../../../shared/constants';

export const usePassStore = create((set) => ({
  pass: null,
  qrCode: null,
  isLoading: false,
  error: null,
  expiresAt: null,
  isActive: false,

  setPass: (pass) => set({ pass }),
  setQRCode: (qrCode) => set({ qrCode }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActive: (isActive) => set({ isActive }),

  generatePass: (passData) => {
    const expiresAt = Date.now() + PASS_TIMEOUT;
    set({
      pass: passData,
      expiresAt,
      isActive: true,
      error: null,
    });

    // Таймер для автоматического скрытия пропуска
    const timer = setTimeout(() => {
      set({ isActive: false });
    }, PASS_TIMEOUT);

    return timer;
  },

  hidePass: () => set({ isActive: false, pass: null, qrCode: null }),
  clearPass: () => set({ pass: null, qrCode: null, expiresAt: null, isActive: false }),
}));
