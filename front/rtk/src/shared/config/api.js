export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH: '/refresh',
  GET_INFO: '/get_info',

  // Pass
  GENERATE_PASS: '/qr/generation',
};
