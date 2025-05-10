import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, TextInput} from 'react-native';
import {ChallengeTwoScreenProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../config/api';

const ChallengeTwoScreen: React.FC<ChallengeTwoScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hidden admin access function - not visible in UI
  const checkAdminAccess = async (query: string) => {
    if (query.toLowerCase() === 'admin') {
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
        }
      } catch (error: any) {
        console.error('Admin access error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>User Dashboard</Text>
        <Text style={styles.description}>
          Welcome to the user dashboard. Use the search feature to find what you need.
        </Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              checkAdminAccess(text);
            }}
          />
        </View>

        {loading && <LoadingSpinner size="small" />}
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
  searchContainer: {
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ChallengeTwoScreen;
