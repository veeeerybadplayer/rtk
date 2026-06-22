export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/users/register',
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  
  // Pass
  GENERATE_PASS: '/qrgen/generation',
  GET_PASS_STATUS: '/qrgen/status',
};
