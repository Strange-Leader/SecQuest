// HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import {HomeScreenProps} from '../types/navigation';
import ConnectionTest from '../components/ConnectionTest';

const challenges = [
  {
    name: 'M1: Improper Credential Usage',
    description: 'Weak or hardcoded credentials.',
    route: 'ChallengeOne',
  },
  {
    name: 'M2: Interface Reliance Flaw',
    description: 'Low-privileged users can execute admin functions.',
    route: 'ChallengeTwo',
  },
  {
    name: 'M3: Log Injection Vulnerability',
    description: 'Insecure logging practices.',
    route: 'ChallengeThree',
  },
  {
    name: 'Challenge 4: 2FA Bypass',
    description: 'Bypass two-factor authentication.',
    route: 'ChallengeFour',
  },
  {
    name: 'Challenge 5: TLS Bypass',
    description: 'Exploit TLS vulnerabilities.',
    route: 'ChallengeFive',
  },
  {
    name: 'Challenge 6: License Check Bypass',
    description: 'Bypass license validation.',
    route: 'ChallengeSix',
  },
  {
    name: 'Challenge 7: AI Model Extraction',
    description: 'Extract AI model information.',
    route: 'ChallengeSeven',
  },
  {
    name: 'Challenge 8: Local Storage Exploit',
    description: 'Exploit local storage vulnerabilities.',
    route: 'ChallengeEight',
  },
  {
    name: 'Challenge 9: Crypto Implementation Flaws',
    description: 'Find and exploit cryptographic weaknesses.',
    route: 'ChallengeNine',
  },
];

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Select A CTF Challenge</Text>
          
          <View style={styles.connectionTestContainer}>
            <ConnectionTest />
          </View>

          {challenges.map((challenge, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => navigation.navigate(challenge.route as any)}>
              <Text style={styles.buttonText}>{challenge.name}</Text>
              <Text style={styles.description}>{challenge.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  connectionTestContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default HomeScreen;
