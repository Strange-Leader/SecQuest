import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {AdminPanelScreenProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({route}) => {
  const flag = route.params?.flag || 'CTF{ADMIN_ACCESS_GRANTED}';
  
  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.description}>
            Welcome to the admin panel. This area should be restricted to admin users only.
          </Text>
          <View style={styles.flagContainer}>
            <Text style={styles.flagLabel}>Flag:</Text>
            <Text style={styles.flag}>{flag}</Text>
          </View>
          <Text style={styles.hint}>
            Hint: The system trusts client-side headers for authorization.
          </Text>
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
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
  flagContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  flagLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  flag: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AdminPanelScreen; 