import CryptoJS from 'crypto-js';

// Intentionally weak key generation
export const generateWeakKey = () => {
  // Use timestamp for predictable key generation
  const timestamp = Date.now().toString();
  // Use weak key derivation
  return CryptoJS.MD5('CTF_KEY_' + timestamp).toString();
};

// Weak encryption using AES-ECB mode
export const encrypt = (text, key) => {
  try {
    // Use static IV (weak)
    const iv = CryptoJS.enc.Hex.parse('CTF_IV_123');

    // Use ECB mode (weak)
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv,
    });

    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

// Weak decryption using AES-ECB mode
export const decrypt = (encryptedText, key) => {
  try {
    // Use static IV (weak)
    const iv = CryptoJS.enc.Hex.parse('CTF_IV_123');

    // Use ECB mode (weak)
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

// Intentionally exposed crypto details
export const getCryptoDetails = () => {
  return {
    algorithm: 'AES-ECB',
    keySize: 128,
    blockSize: 16,
    iv: 'CTF_IV_123',
    keyPattern: 'CTF_KEY_',
    hint: 'The app uses AES in ECB mode with a static IV and predictable key generation. Try analyzing the encryption pattern!',
  };
};
