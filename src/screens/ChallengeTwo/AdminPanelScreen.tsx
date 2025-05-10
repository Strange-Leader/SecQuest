import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AdminPanelScreenProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import {ENCRYPTED_FLAGS, decryptFlag} from '../../utils/encryption';

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = () => {
  const flag = decryptFlag(ENCRYPTED_FLAGS.CHALLENGE_TWO);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.description}>
          Welcome to the admin panel. This area should be restricted to admin users only.
        </Text>
        <Text style={styles.flag}>{flag}</Text>
        <Text style={styles.hint}>
          Hint: The system trusts client-side headers for authorization.
        </Text>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f4511e',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  flag: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AdminPanelScreen; 