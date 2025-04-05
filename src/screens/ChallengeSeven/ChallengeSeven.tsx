import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { askAI } from '../../utils/AIModel'; // Import AI function
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import { handleError } from '../../utils/errorHandler';

const ChallengeSeven = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await askAI(question);
      setAnswer(`AI: ${response}`);
    } catch (err) {
      handleError(err, 'AI Query Error');
      setError('Failed to fetch AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.subtitle}>Challenge 7: Ask AI a Question</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your question here..."
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAskQuestion}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Ask AI</Text>
          </TouchableOpacity>
        </View>

        {loading && <LoadingSpinner />}

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          answer && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>Response:</Text>
              <Text style={styles.response}>{answer}</Text>
            </View>
          )
        )}
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
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    marginVertical: 10,
  },
  responseContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  response: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default ChallengeSeven;