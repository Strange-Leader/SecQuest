import api from '../../config/api';
import { LicenseResponse, PurchaseResponse, Level } from '../../types/challenges';

const BASE_URL = 'http://localhost:3006';

interface LicenseResponse {
  hasLicense: boolean;
  levels: Level[];
}

interface Level {
  id: number;
  name: string;
  isLocked: boolean;
  description: string;
  content?: string;
}

interface PurchaseResponse {
  success: boolean;
  message: string;
  hint?: string;
}

// Mock license validation (intentionally weak)
const validateLicense = (licenseData: any): boolean => {
  // Weak validation that can be bypassed
  return licenseData && licenseData.signature === 'valid_signature';
};

export const checkLicense = async (): Promise<LicenseResponse> => {
  try {
    const response = await api.get('/challenge6/check-license');
    return response.data;
  } catch (error) {
    throw new Error('License check failed. Hint: Try to bypass the license validation!');
  }
};

export const getLevelContent = async (levelId: number): Promise<string> => {
  try {
    const response = await api.get(`/challenge6/level/${levelId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get level content. Hint: Check the request parameters!');
  }
};

export const purchaseLicense = async (): Promise<PurchaseResponse> => {
  try {
    const response = await api.post('/challenge6/purchase-license', {
      // Intentionally weak purchase validation
      paymentId: 'mock_payment_' + Date.now(),
      amount: 9.99,
    });
    return response.data;
  } catch (error) {
    throw new Error('Purchase failed. Hint: The payment validation might be weak!');
  }
}; 