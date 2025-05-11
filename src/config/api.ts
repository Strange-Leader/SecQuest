import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.199.54:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Connection': 'keep-alive'
  },
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
  // Add keep-alive settings with specific configuration
  httpAgent: new (require('http').Agent)({ 
    keepAlive: true,
    timeout: 15000,
    maxSockets: 1
  }),
  httpsAgent: new (require('https').Agent)({ 
    keepAlive: true,
    timeout: 15000,
    maxSockets: 1
  })
});

// Request interceptor for API calls
api.interceptors.request.use(
  config => {
    // Ensure headers are properly set
    if (config.headers) {
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
      config.headers['Connection'] = 'keep-alive';
    }
    
    // Log the full URL and request details
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('Making request to:', fullUrl);
    console.log('Request configuration:', {
      url: fullUrl,
      method: config.method,
      headers: config.headers,
      data: config.data,
      timeout: config.timeout,
      validateStatus: config.validateStatus
    });
    
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for API calls
api.interceptors.response.use(
  response => {
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  error => {
    // Handle errors globally with detailed logging
    if (error.response) {
      // Server responded with error
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error Details:', {
        request: error.request,
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
          timeout: error.config?.timeout
        }
      });
      
      // Provide more specific error messages
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({message: 'Request timed out. Please check your network connection.'});
      } else if (error.code === 'ERR_NETWORK') {
        return Promise.reject({message: 'Network error. Please ensure you are connected to the same network as the server.'});
      }
      return Promise.reject({message: 'Network error occurred. Please check your connection.'});
    } else {
      // Something else happened
      console.error('Unexpected Error:', {
        message: error.message,
        stack: error.stack
      });
      return Promise.reject({message: 'An unexpected error occurred'});
    }
  },
);

export default api; 