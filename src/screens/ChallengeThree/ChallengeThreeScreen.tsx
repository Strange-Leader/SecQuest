import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {ChallengeThreeProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import {ENCRYPTED_FLAGS, decryptFlag} from '../../utils/encryption';

interface Log {
  timestamp: string;
  level: string;
  message: string;
}

const FLAG_TEXT = decryptFlag(ENCRYPTED_FLAGS.CHALLENGE_THREE);

const ChallengeThreeScreen: React.FC<ChallengeThreeProps> = ({navigation}) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Log[]>([
    {
      timestamp: '2024-01-01 00:00:00',
      level: 'TRACE',
      message: 'App started successfully',
    },
    {
      timestamp: '2024-01-01 00:00:01',
      level: 'DEBUG',
      message: 'User session initialized',
    },
    {
      timestamp: '2024-01-01 00:00:02',
      level: 'INFO',
      message: 'System running smoothly',
    },
    {
      timestamp: '2024-01-01 00:00:03',
      level: 'WARN',
      message: 'Minor issue detected',
    },
    {
      timestamp: '2024-01-01 00:00:04',
      level: 'ERROR',
      message: 'Failed login attempt detected',
    },
    {
      timestamp: '2024-01-01 00:00:05',
      level: 'FATAL',
      message: 'System crash! Restarting...',
    },
  ]);
  const [flag, setFlag] = useState(false);
  const [hints, setHints] = useState([
    'Hint 1: The system only accepts INFO level logs for user input',
    'Hint 2: The system has basic input validation',
    'Hint 3: Try to think about how log levels work',
    'Hint 4: The restriction checks for exact "OFF" match in the first line',
    'Hint 5: Look for ways to use escape sequences in your input',
  ]);
  const [showHints, setShowHints] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (text: string) => {
    // Replace actual newlines with \n escape sequence
    const processedText = text.replace(/\n/g, '\\n');
    setInput(processedText);
  };

  const validateLog = (input: string) => {
    // Basic validation rules
    if (input.includes(';') || input.includes('--')) {
      Alert.alert('Invalid Input', 'SQL injection attempts are not allowed!');
      return false;
    }
    if (input.length > 1000) {
      Alert.alert(
        'Invalid Input',
        'Log entry too long! Maximum length is 1000 characters.',
      );
      return false;
    }
    // Check for direct "OFF" input in the first line
    const firstLine = input.split('\\n')[0];
    if (firstLine.includes('OFF')) {
      Alert.alert('Invalid Input', 'Direct logging of "OFF" is not allowed!');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const normalizedInput = input.trim();

      if (!validateLog(normalizedInput)) {
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check for successful log injection in any line
      const lines = normalizedInput.split('\\n');
      const hasOffInAnyLine = lines.some(
        line =>
          line.includes('OFF') || line.includes('off') || line.includes('Off'),
      );

      if (hasOffInAnyLine) {
        setFlag(true);
        setLogs([
          ...logs,
          {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `User Input: ${normalizedInput}`,
          },
          {
            timestamp: new Date().toISOString(),
            level: 'OFF',
            message: 'Logging disabled',
          },
          {
            timestamp: new Date().toISOString(),
            level: 'FLAG',
            message: FLAG_TEXT,
          },
        ]);
        Alert.alert(
          '🎉 Flag Unlocked!',
          'You successfully injected the OFF log!',
        );
      } else {
        setLogs([
          ...logs,
          {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `User Input: ${normalizedInput}`,
          },
        ]);
      }

      setInput('');
    } catch (error) {
      Alert.alert('Error', 'Failed to process log entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>🔍 Log Injection Challenge</Text>
        <Text style={styles.description}>
          The system logs events at different levels: TRACE, DEBUG, INFO, WARN,
          ERROR, FATAL. Only INFO level logs are accepted for user input. Your
          goal is to inject a log entry containing "OFF" through clever input
          manipulation.
        </Text>
        <Text style={styles.warning}>
          Direct logging of "OFF" in the first line is not allowed! Try to find
          a way to bypass the input validation.
        </Text>

        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setShowHints(!showHints)}>
          <Text style={styles.hintButtonText}>
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </Text>
        </TouchableOpacity>

        {showHints && (
          <View style={styles.hintsContainer}>
            {hints.map((hint, index) => (
              <Text key={index} style={styles.hintText}>
                {hint}
              </Text>
            ))}
          </View>
        )}

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={handleInputChange}
          placeholder="Enter log message (INFO level only)... Use \n for new lines"
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={styles.buttonText}>Submit Log</Text>
          )}
        </TouchableOpacity>

        <ScrollView style={styles.logContainer}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log.message}
            </Text>
          ))}
        </ScrollView>

        {flag && (
          <View style={styles.flagContainer}>
            <Text style={styles.flagText}>{FLAG_TEXT}</Text>
          </View>
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
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
    color: '#666',
    lineHeight: 22,
  },
  warning: {
    marginBottom: 15,
    color: 'red',
    fontWeight: 'bold',
  },
  hintButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  hintButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  hintsContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  hintText: {
    color: '#666',
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  logText: {
    color: '#333',
    marginVertical: 5,
  },
  flagContainer: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  flagText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ChallengeThreeScreen;
