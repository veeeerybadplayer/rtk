import { httpClient } from '../../../shared/api/http';
import { API_ENDPOINTS } from '../../../shared/config/api';
import { mockPassAPI, isMockEnabled } from '../../../shared/api/mockAPI';

export const passAPI = {
  generatePass: async () => {
    if (isMockEnabled()) {
      console.log('🧪 Используется Mock API (развитие)');
      return mockPassAPI.generatePass();
    }

    const response = await httpClient.post(API_ENDPOINTS.GENERATE_PASS);
    return response.data;
  },

  getPassStatus: async () => {
    if (isMockEnabled()) {
      return mockPassAPI.getPassStatus();
    }

    const response = await httpClient.get(API_ENDPOINTS.GET_PASS_STATUS);
    return response.data;
  },
};