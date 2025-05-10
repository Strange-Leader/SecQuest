import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { checkBackendConnection } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing connection...');
    
    try {
      const response = await checkBackendConnection();
      setStatus('success');
      setMessage(`Connection successful! Backend status: ${response.status}`);
    } catch (error: any) {
      setStatus('error');
      setMessage(`Connection failed: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, status === 'loading' && styles.buttonDisabled]} 
        onPress={testConnection}
        disabled={status === 'loading'}
      >
        <Text style={styles.buttonText}>
          {status === 'loading' ? 'Testing...' : 'Test Backend Connection'}
        </Text>
      </TouchableOpacity>
      
      {message ? (
        <Text style={[
          styles.message,
          status === 'success' && styles.successMessage,
          status === 'error' && styles.errorMessage
        ]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  successMessage: {
    color: '#34C759',
  },
  errorMessage: {
    color: '#FF3B30',
  },
});

export default ConnectionTest; 