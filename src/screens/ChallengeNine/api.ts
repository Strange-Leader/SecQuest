import api from '../../config/api';
import {Message} from '../../types/challenges';

// Intentionally weak message storage (in a real app, this would be properly secured)
const MESSAGES: Message[] = [
  {
    id: '1',
    encryptedText: 'U2FsdGVkX1+9X5njd4tdKVoXSw==',
    timestamp: new Date().toISOString(),
    decryptedText: 'CTF{WEAK_CRYPTO_IMPLEMENTATION}',
  },
];

export const getMessages = async (): Promise<Message[]> => {
  try {
    // In a real app, this would be an API call
    return MESSAGES;
  } catch (error) {
    throw new Error('Failed to get messages. Hint: Check the message storage!');
  }
};

export const encryptMessage = async (
  message: string,
  key: string,
): Promise<void> => {
  try {
    // Intentionally weak encryption
    const encryptedText = Buffer.from(message).toString('base64');
    const newMessage: Message = {
      id: Date.now().toString(),
      encryptedText,
      timestamp: new Date().toISOString(),
    };
    MESSAGES.push(newMessage);
  } catch (error) {
    throw new Error('Failed to encrypt message. Hint: The encryption is weak!');
  }
};

export const decryptMessage = async (
  encryptedText: string,
  key: string,
): Promise<string> => {
  try {
    // Intentionally weak decryption
    const decryptedText = Buffer.from(encryptedText, 'base64').toString();
    return decryptedText;
  } catch (error) {
    throw new Error('Failed to decrypt message. Hint: Try analyzing the encryption!');
  }
}; 