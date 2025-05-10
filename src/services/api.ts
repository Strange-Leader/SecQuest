import axios from 'axios';
import { BASE_URL, API_ENDPOINTS } from '../config/api.config';

console.log('Using API URL:', BASE_URL); // Debug log

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Full URL:', `${config.baseURL || ''}${config.url || ''}`);
    console.log('Request Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Is the backend server running?');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Host not found. Check your IP address and network connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Connection timed out. Check your network connection.');
    }
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      }
    });
    return Promise.reject(error);
  }
);

export const checkBackendConnection = async () => {
  try {
    // First try the test endpoint
    const testResponse = await api.get(API_ENDPOINTS.test);
    console.log('Test endpoint response:', testResponse.data);
    
    // Then try the health endpoint
    const healthResponse = await api.get(API_ENDPOINTS.health);
    return healthResponse.data;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    throw error;
  }
};

export { API_ENDPOINTS };
export default api; 