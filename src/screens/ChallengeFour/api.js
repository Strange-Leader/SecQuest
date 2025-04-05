import axios from 'axios';

const SERVER_URL = 'http://localhost:3000'; // Update with your server URL

export const login = async userID => {
  try {
    const response = await axios.post(`${SERVER_URL}/login`, {userID});
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data);
    throw error;
  }
};

export const verify2FA = async (token, otpCode) => {
  try {
    const response = await axios.post(`${SERVER_URL}/verify-2fa`, {
      token,
      otpCode,
    });
    return response.data;
  } catch (error) {
    console.error('2FA verification failed:', error.response?.data);
    throw error;
  }
};

export const getFlag = async token => {
  try {
    const response = await axios.get(`${SERVER_URL}/flag`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get flag:', error.response?.data);
    throw error;
  }
};
