import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, TextInput} from 'react-native';
import {ChallengeTwoProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';

const ChallengeTwoScreen: React.FC<ChallengeTwoProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First check if we can reach the server using the test endpoint
      try {
        console.log('Checking server connection...');
        const testCheck = await axios.get('http://192.168.199.54:3000/test', {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          },
          timeout: 15000,
          validateStatus: (status) => status >= 200 && status < 500
        });
        
        console.log('Server test response:', testCheck.data);
        if (!testCheck.data.message.includes('reachable')) {
          throw new Error('Server is not reachable');
        }
      } catch (error: any) {
        console.error('Server connection check failed:', error);
        setError('Cannot connect to server. Please check your network connection.');
        setLoading(false);
        return;
      }

      // Make the search request
      console.log('Making search request...');
      const response = await axios.post(
        'http://192.168.199.54:3000/api/challenge2/admin/access',
        {
          token: 'user-token',
          query: searchQuery
        },
        {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          },
          timeout: 15000,
          validateStatus: (status) => status >= 200 && status < 500
        },
      );

      console.log('Search response:', response.data);
      
      if (response.data.success) {
        Alert.alert(
          'Success!',
          `Flag: ${response.data.flag}\n\nHint: ${response.data.hint}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('AdminPanel', { flag: response.data.flag })
            }
          ]
        );
      } else {
        // For unsuccessful searches, show a generic message
        Alert.alert(
          'Search Results',
          'No results found. Try searching for something else.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Search error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      setError(error.response?.data?.error || error.message || 'Search failed');
    } finally {
      setLoading(false);
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
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Type here to search..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff3b30',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ChallengeTwoScreen;
