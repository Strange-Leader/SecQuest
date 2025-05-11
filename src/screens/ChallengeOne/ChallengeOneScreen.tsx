import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ChallengeOneProps } from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';
import { ENCRYPTED_FLAGS, decryptFlag } from '../../utils/encryption';

// Use your actual IP address
const API_BASE_URL = 'https://10.15.7.160:3000';

// Hidden credentials (Base64 encoded)
const hiddenUsername = 'petersiddle@gmail.com';
const hiddenPassword = '1q2w3e$R';

const ChallengeOneScreen: React.FC<ChallengeOneProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Check for hardcoded credentials
    if (username === hiddenUsername && password === hiddenPassword) {
      navigation.navigate('Flag', {
        flag: 'CTF{BASIC_AUTH_BYPASS_123}',
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { username, password });
      const response = await axios.post(
        `${API_BASE_URL}/api/challenge1/login`,
        { username, password }
      );

      console.log('Login response:', response.data);

      if (response.data.success) {
        navigation.navigate('Flag', {
          flag: 'CTF{BASIC_AUTH_BYPASS_123}',
        });
      } else {
        Alert.alert(
          'Invalid Credentials',
          response.data.hint || 'Try to find the correct credentials!'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      const err = error as any;
      if (err.response?.status === 401) {
        Alert.alert(
          'Invalid Credentials',
          err.response.data.hint || 'Try to find the correct credentials!'
        );
      } else {
        Alert.alert('Error', 'Failed to process login request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>Login to Access the Flag</Text>
        <Text style={styles.description}>
          This challenge involves bypassing basic authentication. The credentials are hidden somewhere in the code. Can you find them?
        </Text>
        <Text style={[styles.description, { color: '#000', fontWeight: 'bold' }]}>
          Username: {hiddenUsername}
        </Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChallengeOneScreen;
