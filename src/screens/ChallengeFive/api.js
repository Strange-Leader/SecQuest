import api, {login, getProfile, checkCertificate} from '../../config/api';
import {NativeModules} from 'react-native';

// Enable TLS Pinning (Bypass Challenge)
const {SSLPinning} = NativeModules;

// Challenge-specific API functions
export const challengeFiveLogin = async (username, password) => {
  try {
    const response = await api.post('/challenge5/login', {username, password});
    return response.data;
  } catch (error) {
    throw new Error('Login failed. Hint: Try to bypass the TLS protection!');
  }
};

export const getCertificateInfo = async () => {
  try {
    const response = await api.get('/challenge5/certificate-info');
    return response.data;
  } catch (error) {
    throw new Error(
      'Certificate check failed. Hint: The certificate validation might be weak!',
    );
  }
};

export const getSecureData = async token => {
  try {
    const response = await api.get('/challenge5/secure-data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      'Failed to fetch secure data. Hint: Check the TLS configuration!',
    );
  }
};

// Export common functions for reuse
export {login, getProfile, checkCertificate};
