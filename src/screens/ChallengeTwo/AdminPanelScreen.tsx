import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AdminPanelScreenProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({navigation}) => {
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.description}>
          Congratulations! You've successfully gained admin access.
        </Text>
        <Text style={styles.flag}>🎉 FLAG{Admin_Access_Granted_1337}</Text>
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
  },
});

export default AdminPanelScreen; 