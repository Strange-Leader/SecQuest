import api, { API_ENDPOINTS } from '../../services/api';

const SERVER_URL = 'http://localhost:3000'; // Update with your server URL

export const login = async (username, password) => {
  try {
    const response = await api.post(API_ENDPOINTS.challenge4.login, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verify2FA = async (code) => {
  try {
    const response = await api.post(API_ENDPOINTS.challenge4.verify2FA, {
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFlag = async token => {
  try {
    const response = await api.get(`${SERVER_URL}/flag`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get flag:', error.response?.data);
    throw error;
  }
};
