import { httpClient } from '../../../shared/api/http';
import { API_ENDPOINTS } from '../../../shared/config/api';
import { mockAuthAPI, isMockEnabled } from '../../../shared/api/mockAPI';

export const authAPI = {
  // Бэкенд ожидает поле `pwd_h` под пароль и не принимает confirmPassword
  register: async ({ fio, rank, email, password }) => {
    if (isMockEnabled()) {
      return mockAuthAPI.register(email, password);
    }

    const response = await httpClient.post(API_ENDPOINTS.REGISTER, {
      fio,
      rank,
      email,
      pwd_h: password,
    });
    return response.data;
  },

  login: async (email, password) => {
    if (isMockEnabled()) {
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
      return mockAuthAPI.logout();
    }

    const response = await httpClient.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  // Токен лежит в httpOnly cookie и недоступен из JS, поэтому статус
  // авторизации после перезагрузки страницы проверяется этим запросом
  getCurrentUser: async () => {
    if (isMockEnabled()) {
      return mockAuthAPI.getCurrentUser();
    }

    const response = await httpClient.get(API_ENDPOINTS.GET_INFO);
    return response.data;
  },
};
