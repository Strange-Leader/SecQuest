import {encrypt, decrypt} from './crypto';

// Simulated message storage
let messages = [];

// Hidden flag in encrypted message
const FLAG = 'CTF{WEAK_CRYPTO_IMPLEMENTATION}';

// Initialize with flag message
const flagMessage = {
  encryptedText: encrypt(FLAG, 'CTF_KEY_123'),
  timestamp: new Date().toISOString(),
};

messages.push(flagMessage);

export const encryptMessage = async (message, key) => {
  try {
    // Weak encryption with predictable IV
    const encryptedText = encrypt(message, key);

    const newMessage = {
      encryptedText,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    return encryptedText;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

export const decryptMessage = async (encryptedText, key) => {
  try {
    // Weak decryption with predictable IV
    return decrypt(encryptedText, key);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

export const getMessages = async () => {
  // Return all messages including the flag
  return messages;
};

// Intentionally exposed encryption details
export const getEncryptionDetails = () => {
  return {
    algorithm: 'AES-ECB', // Weak ECB mode
    keySize: 128,
    blockSize: 16,
    iv: 'CTF_IV_123', // Static IV
    hint: 'The app uses AES in ECB mode with a static IV. Try analyzing the encryption pattern!',
  };
};
