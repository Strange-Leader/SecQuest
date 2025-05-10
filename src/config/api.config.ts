import { Platform } from 'react-native';

// Get the local IP address for physical devices
const getLocalIP = () => {
  return '192.168.199.54'; // Your laptop's IP address
};

// Base URL configuration
export const BASE_URL = __DEV__ 
  ? Platform.select({
      ios: 'http://localhost:3000',
      android: Platform.isTV ? 'http://10.0.2.2:3000' : `http://${getLocalIP()}:3000`,
      default: `http://${getLocalIP()}:3000`,
    })
  : 'https://your-production-url.com';

// API endpoints
export const API_ENDPOINTS = {
  // Health and test endpoints
  health: '/health',
  test: '/test',
  
  // Challenge 1 endpoints
  challenge1: {
    login: '/api/challenge1/login',
  },
  // Challenge 2 endpoints
  challenge2: {
    adminPanel: '/api/challenge2/admin-panel',
  },
  // Challenge 3 endpoints
  challenge3: {
    log: '/api/challenge3/log',
  },
  // Challenge 4 endpoints
  challenge4: {
    login: '/api/challenge4/login',
    verify2FA: '/api/challenge4/verify-2fa',
    flag: '/api/challenge4/flag',
  },
  // Challenge 5 endpoints
  challenge5: {
    login: '/api/challenge5/login',
    profile: '/api/challenge5/profile',
    certificate: '/api/challenge5/certificate-info',
  },
  // Challenge 6 endpoints
  challenge6: {
    checkLicense: '/api/challenge6/check-license',
    getLevel: '/api/challenge6/level',
    purchaseLicense: '/api/challenge6/purchase-license',
  },
  // Challenge 7 endpoints
  challenge7: {
    modelInfo: '/api/challenge7/model-info',
    processQuery: '/api/challenge7/process-query',
    checkAccess: '/api/challenge7/check-access',
  },
  // Challenge 8 endpoints
  challenge8: {
    saveProfile: '/api/challenge8/save-profile',
    getProfile: '/api/challenge8/get-profile',
  },
  // Challenge 9 endpoints
  challenge9: {
    encrypt: '/api/challenge9/encrypt',
    decrypt: '/api/challenge9/decrypt',
  },
}; 