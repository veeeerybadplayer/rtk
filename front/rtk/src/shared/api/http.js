import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_ENDPOINTS = [API_ENDPOINTS.LOGIN, API_ENDPOINTS.REGISTER, API_ENDPOINTS.REFRESH];

// Access-токен живёт 30 минут, refresh — 7 дней. Раньше фронт не пользовался
// /refresh вообще, поэтому сессия молча умирала через 30 минут даже с живой
// refresh-cookie. Здесь на первый попавшийся 401 пробуем один раз тихо
// обновить access-токен и повторить запрос; если и это 401 — значит сессии
// действительно больше нет, и это отдаётся вызывающему коду как есть
// (никаких window.location-редиректов — это уже ловили как баг).
let refreshPromise = null;

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthEndpoint = config && AUTH_ENDPOINTS.includes(config.url);

    if (response?.status === 401 && config && !config._retriedAfterRefresh && !isAuthEndpoint) {
      config._retriedAfterRefresh = true;

      try {
        refreshPromise = refreshPromise || httpClient.post(API_ENDPOINTS.REFRESH);
        await refreshPromise;
        return httpClient(config);
      } catch (refreshError) {
        return Promise.reject(error);
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);
