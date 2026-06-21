export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Pass
  GENERATE_PASS: '/pass/generate',
  GET_PASS_STATUS: '/pass/status',
};
