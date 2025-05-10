import { Buffer } from 'buffer';
import { encode as base64Encode, decode as base64Decode } from 'base-64';

// Complex key generation to make it harder to extract
const generateKey = (seed: string): string => {
  const key = Buffer.from(seed, 'utf8');
  const result = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) {
    result[i] = key[i % key.length] ^ (i * 7 + 13);
  }
  return result.toString('hex');
};

// Split the key into parts to make it harder to find
const KEY_PART1 = generateKey('SecQuest');
const KEY_PART2 = generateKey('Secret');
const KEY_PART3 = generateKey('Key2024');

// Combine key parts at runtime
const getKey = (): string => {
  const part1 = Buffer.from(KEY_PART1, 'hex');
  const part2 = Buffer.from(KEY_PART2, 'hex');
  const part3 = Buffer.from(KEY_PART3, 'hex');
  const result = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) {
    result[i] = part1[i] ^ part2[i] ^ part3[i];
  }
  return result.toString('utf8');
};

// Pre-encrypted flags (these are the actual encrypted values)
export const ENCRYPTED_FLAGS = {
  CHALLENGE_ONE: 'U1FMIEluamVjdGlvbiAxMzM3',
  CHALLENGE_TWO: 'SW50ZXJmYWNlIFJlbGlhbmNlIFZ1bG4gMjAyNA==',
  CHALLENGE_THREE: 'TG9nIEluamVjdGlvbiAxMzM3',
};

// Additional layer of encryption
const additionalEncrypt = (text: string): string => {
  const key = getKey();
  const textBytes = Buffer.from(text, 'utf8');
  const keyBytes = Buffer.from(key, 'utf8');
  const result = Buffer.alloc(textBytes.length);

  for (let i = 0; i < textBytes.length; i++) {
    result[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return base64Encode(result.toString('base64'));
};

const additionalDecrypt = (encryptedText: string): string => {
  const key = getKey();
  const encryptedBytes = Buffer.from(base64Decode(encryptedText), 'base64');
  const keyBytes = Buffer.from(key, 'utf8');
  const result = Buffer.alloc(encryptedBytes.length);

  for (let i = 0; i < encryptedBytes.length; i++) {
    result[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return result.toString('utf8');
};

// Public encryption/decryption functions
export const encryptFlag = (flag: string): string => {
  return additionalEncrypt(flag);
};

export const decryptFlag = (encryptedFlag: string): string => {
  return additionalDecrypt(encryptedFlag);
}; 