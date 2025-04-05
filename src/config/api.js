import axios from 'axios';

// API Configuration
const API_PORT = process.env.API_PORT || '3000';
const API_BASE_URL =
  process.env.API_BASE_URL || `https://localhost:${API_PORT}`;

// Common fetch options for CTF challenges
const fetchOptions = {
  // Intentionally weak TLS configuration for CTF
  rejectUnauthorized: false,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  ...fetchOptions,
});

// Request interceptor for debugging
api.interceptors.request.use(
  request => {
    console.log('Request:', {
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.data,
    });
    return request;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

// Common API functions
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', {username, password});
    return response.data;
  } catch (error) {
    throw new Error(
      'Authentication failed. Hint: Check the security mechanisms!',
    );
  }
};

export const getProfile = async token => {
  try {
    const response = await api.get('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch profile. Hint: Check the authorization!');
  }
};

export const checkCertificate = async () => {
  try {
    const response = await api.get('/certificate-info');
    return response.data;
  } catch (error) {
    throw new Error(
      'Certificate check failed. Hint: Try to bypass the TLS protection!',
    );
  }
};

export default api;
