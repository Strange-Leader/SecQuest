import {Alert} from 'react-native';

export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);

  // Extract error message and hint
  const message = error.message || 'An unexpected error occurred';
  const hint = error.hint || 'Check the console for more details';

  // Show alert with error details
  Alert.alert(`Error in ${context}`, `${message}\n\nHint: ${hint}`, [
    {text: 'OK'},
  ]);

  // Return formatted error for UI
  return {
    message,
    hint,
    timestamp: new Date().toISOString(),
  };
};

export const createError = (message, hint) => {
  const error = new Error(message);
  error.hint = hint;
  return error;
};

export const isNetworkError = error => {
  return (
    error.message.includes('Network Error') ||
    error.message.includes('Failed to fetch')
  );
};

export const isAuthError = error => {
  return (
    error.response?.status === 401 ||
    error.message.includes('Authentication failed')
  );
};

export const isServerError = error => {
  return error.response?.status >= 500;
};
