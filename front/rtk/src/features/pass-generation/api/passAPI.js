import { httpClient } from '../../../shared/api/http';
import { API_ENDPOINTS } from '../../../shared/config/api';

export const passAPI = {
  generatePass: async () => {
    const response = await httpClient.post(API_ENDPOINTS.GENERATE_PASS);
    return response.data;
  },

  getPassStatus: async (passId) => {
    const response = await httpClient.get(`${API_ENDPOINTS.GET_PASS_STATUS}/${passId}`);
    return response.data;
  },
};
