import { httpClient } from '../../../shared/api/http';
import { API_ENDPOINTS } from '../../../shared/config/api';
import { mockPassAPI, isMockEnabled } from '../../../shared/api/mockAPI';

export const passAPI = {
  generatePass: async () => {
    if (isMockEnabled()) {
      return mockPassAPI.generatePass();
    }

    const response = await httpClient.post(API_ENDPOINTS.GENERATE_PASS);
    return response.data;
  },
};
