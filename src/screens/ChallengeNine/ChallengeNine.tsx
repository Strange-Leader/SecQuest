import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {encryptMessage, decryptMessage, getMessages} from './api';
import {generateWeakKey} from './crypto';
import {Message} from '../../types/challenges';
import {ChallengeNineProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import {handleError} from '../../utils/errorHandler';

const ChallengeNine: React.FC<ChallengeNineProps> = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState('');

  useEffect(() => {
    // Generate weak key on component mount
    const weakKey = generateWeakKey();
    setKey(weakKey);
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const loadedMessages = await getMessages();
      setMessages(loadedMessages);
    } catch (error) {
      handleError(error, 'Message Load');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setLoading(true);
    try {
      // Encrypt message with weak encryption
      const encryptedMessage = await encryptMessage(message, key);
      await loadMessages();
      setMessage('');
    } catch (error) {
      handleError(error, 'Message Send');
    } finally {
      setLoading(false);
    }
  };

  const handleDecryptMessage = async (encryptedText: string) => {
    setLoading(true);
    try {
      // Decrypt message with weak decryption
      const decryptedText = await decryptMessage(encryptedText, key);
      Alert.alert('Decrypted Message', decryptedText);
    } catch (error) {
      handleError(error, 'Message Decrypt');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Challenge 9: Crypto Implementation Flaws
        </Text>
        <Text style={styles.description}>
          This challenge involves exploiting weak cryptographic implementations
          in a secure messaging app. The app uses outdated algorithms and weak
          key generation. Your goal is to extract the hidden flag!
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter message"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendMessage}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send Message'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.messagesContainer}>
          <Text style={styles.sectionTitle}>Messages:</Text>
          {messages.map(msg => (
            <TouchableOpacity
              key={msg.id}
              style={styles.messageItem}
              onPress={() => handleDecryptMessage(msg.encryptedText)}>
              <Text style={styles.messageText}>{msg.encryptedText}</Text>
              <Text style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.hint}>
          Hint: The app uses weak encryption algorithms and predictable key
          generation. Try analyzing the crypto implementation!
        </Text>
      </ScrollView>
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
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  messagesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  hint: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ChallengeNine;
