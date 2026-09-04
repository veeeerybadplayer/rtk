import { create } from 'zustand';
import { STORAGE_KEYS } from '../../../shared/constants';
import { authAPI } from '../api/authAPI';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  // Отличает "ещё не проверили cookie-сессию" от "точно не авторизован"
  isInitialized: false,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  // Токен лежит в httpOnly cookie и недоступен из JS, поэтому при загрузке
  // приложения статус авторизации проверяется запросом к /get_info,
  // а не чтением localStorage
  checkAuth: async () => {
    try {
      const user = await authAPI.getCurrentUser();
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      set({ user, isAuthenticated: true, isInitialized: true });
    } catch {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));
