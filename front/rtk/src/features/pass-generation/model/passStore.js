import { create } from 'zustand';
import { passAPI } from '../api/passAPI';

export const usePassStore = create((set, get) => ({
  passData: null,
  qrCode: null,
  isLoading: false,
  error: null,
  isPassActive: false,
  expiryTimeoutId: null,

  generatePass: async () => {
    // Гасим таймер предыдущего пропуска, иначе он может стереть с экрана
    // только что сгенерированный новый пропуск раньше времени
    const prevTimeoutId = get().expiryTimeoutId;
    if (prevTimeoutId) clearTimeout(prevTimeoutId);

    set({ isLoading: true, error: null });
    try {
      const response = await passAPI.generatePass();

      const timeoutId = setTimeout(() => {
        set({ isPassActive: false, passData: null, qrCode: null, expiryTimeoutId: null });
      }, 5 * 60 * 1000);

      set({
        // Бэкенд не отдаёт created_at, фиксируем время получения пропуска на фронте
        passData: { ...response, created_at: new Date().toISOString() },
        qrCode: response.qr_code,
        isLoading: false,
        isPassActive: true,
        expiryTimeoutId: timeoutId,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Ошибка генерации пропуска',
        isLoading: false,
      });
    }
  },

  deactivatePass: async () => {
    const timeoutId = get().expiryTimeoutId;
    if (timeoutId) clearTimeout(timeoutId);

    set({
      passData: null,
      qrCode: null,
      isPassActive: false,
      error: null,
      expiryTimeoutId: null,
    });

    try {
      // Best-effort: инвалидируем токен на сервере, чтобы отменённый QR
      // нельзя было использовать на проходной до истечения 5 минут
      await passAPI.cancelPass();
    } catch {
      // Локальный пропуск уже скрыт из UI; если запрос не прошёл (например,
      // сессия уже истекла), сервер всё равно снимет пропуск по TTL
    }
  },

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));
