import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {ChallengeEightProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../config/api';

interface DataResponse {
  id: string;
  content: string;
  timestamp: string;
}

const ChallengeEightScreen: React.FC<ChallengeEightProps> = ({navigation}) => {
  const [data, setData] = useState<DataResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/challenge8/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.flag) {
        navigation.navigate('Flag', {flag: response.data.flag});
      } else {
        setData(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>API Token Challenge</Text>
        <Text style={styles.description}>
          Try to access the protected data. The flag is hidden in the API
          response.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter API token"
          value={token}
          onChangeText={setToken}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={fetchData}
          disabled={loading}>
          <Text style={styles.buttonText}>Fetch Data</Text>
        </TouchableOpacity>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <ScrollView style={styles.dataContainer}>
            {data.map(item => (
              <View key={item.id} style={styles.dataItem}>
                <Text style={styles.dataId}>ID: {item.id}</Text>
                <Text style={styles.dataContent}>{item.content}</Text>
                <Text style={styles.dataTimestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    flex: 1,
  },
  dataItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dataId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dataContent: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  dataTimestamp: {
    fontSize: 12,
    color: '#999',
  },
});

export default ChallengeEightScreen;
