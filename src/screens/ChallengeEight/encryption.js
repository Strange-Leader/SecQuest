// Intentionally weak encryption key (hardcoded and easily guessable)
const WEAK_KEY = 'CTF_CHALLENGE_KEY_123';

// Weak encryption function using XOR and base64
export const encryptData = data => {
  try {
    // Convert data to string
    const str = JSON.stringify(data);

    // XOR encryption with weak key
    let encrypted = '';
    for (let i = 0; i < str.length; i++) {
      encrypted += String.fromCharCode(
        str.charCodeAt(i) ^ WEAK_KEY.charCodeAt(i % WEAK_KEY.length),
      );
    }

    // Add weak salt (predictable)
    const salt = 'CTF_SALT_' + Date.now();
    const saltedData = salt + encrypted;

    // Base64 encode
    return Buffer.from(saltedData).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Weak decryption function
export const decryptData = encryptedData => {
  try {
    // Base64 decode
    const decoded = Buffer.from(encryptedData, 'base64').toString();

    // Remove salt (predictable pattern)
    const data = decoded.substring(decoded.indexOf('_') + 1);

    // XOR decryption with weak key
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(
        data.charCodeAt(i) ^ WEAK_KEY.charCodeAt(i % WEAK_KEY.length),
      );
    }

    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Intentionally exposed encryption details (vulnerability)
export const getEncryptionDetails = () => {
  return {
    algorithm: 'XOR',
    keyLength: WEAK_KEY.length,
    saltPattern: 'CTF_SALT_',
    encoding: 'base64',
    hint: 'The encryption uses a hardcoded key and predictable salt. Try analyzing the encryption pattern!',
  };
};
