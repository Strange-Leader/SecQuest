import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {ChallengeTwoScreenProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../config/api';

const ChallengeTwoScreen: React.FC<ChallengeTwoScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAdminAccess = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        '/api/challenge2/admin/access',
        {
          token: 'user-token',
        },
        {
          headers: {
            'X-Admin-Token': 'true',
            'X-User-Role': 'admin',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('AdminPanel');
      } else {
        Alert.alert(
          'Access Denied',
          'You are not authorized! Try to find a way to bypass the authorization.',
        );
      }
    } catch (error: any) {
      console.error('Admin access error:', error);
      Alert.alert(
        'Error',
        error.message ||
          'Failed to access admin panel. The system might have weak authorization checks.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>User Dashboard</Text>
        <Text style={styles.description}>
          Try to access the admin panel. The system has weak authorization
          checks.
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAdminAccess}
          disabled={loading}>
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={styles.buttonText}>Access Admin Settings</Text>
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

export default ChallengeTwoScreen;
