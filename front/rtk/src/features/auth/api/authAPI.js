import { httpClient } from '../../../shared/api/http';
import { API_ENDPOINTS } from '../../../shared/config/api';
import { mockAuthAPI, isMockEnabled } from '../../../shared/api/mockAPI';

export const authAPI = {
  register: async (email, password) => {
    if (isMockEnabled()) {
      console.log('🧪 Используется Mock API (развитие)');
      return mockAuthAPI.register(email, password);
    }

    const response = await httpClient.post(API_ENDPOINTS.REGISTER, {
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    if (isMockEnabled()) {
      console.log('🧪 Используется Mock API (развитие)');
      return mockAuthAPI.login(email, password);
    }

    const response = await httpClient.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    if (isMockEnabled()) {
      return { success: true };
    }

    const response = await httpClient.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },
};
