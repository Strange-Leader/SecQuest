// Common Types
export interface ApiResponse {
  success: boolean;
  message: string;
  hint?: string;
  error?: string;
}

export interface LoginResponse extends ApiResponse {
  token?: string;
}

// Challenge 5: TLS Bypass
export interface CertificateInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  cipherSuite: string;
  tlsVersion: string;
}

export interface Profile {
  username: string;
  email: string;
  role: string;
  flag: string;
}

// Challenge 6: License Check
export interface Level {
  id: number;
  name: string;
  isLocked: boolean;
  description: string;
  content?: string;
}

export interface LicenseResponse extends ApiResponse {
  hasLicense: boolean;
  levels: Level[];
}

export interface PurchaseResponse extends ApiResponse {
  licenseKey?: string;
}

// Challenge 7: AI Model
export interface ModelPrediction {
  prediction: string;
  confidence: number;
  flag?: string;
}

export interface ModelInfo {
  name: string;
  version: string;
  architecture: string;
  parameters: number;
  accuracy: number;
}

// Challenge 8: Local Storage
export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  profilePic: string | null;
  lastUpdated: string;
}

export interface StoredData {
  key: string;
  value: string;
  encrypted: boolean;
  timestamp: string;
}

// Challenge 9: Crypto
export interface Message {
  id: string;
  encryptedText: string;
  timestamp: string;
  decryptedText?: string;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  algorithm: string;
}

// Challenge-specific error types
export interface ChallengeError extends Error {
  hint?: string;
  context?: string;
} 