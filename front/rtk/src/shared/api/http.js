import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Намеренно без глобального редиректа на 401: /get_info штатно отвечает 401,
// когда пользователь просто не залогинен (например, зашёл на /register), и
// это не повод его никуда перекидывать. Реальный гейтинг делают
// authStore.checkAuth() и ProtectedRoute в App.js.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
