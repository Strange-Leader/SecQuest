import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FlagScreenProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';

const FlagScreen: React.FC<FlagScreenProps> = ({route}) => {
  const {flag} = route.params;

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Congratulations! 🎉</Text>
        <Text style={styles.flag}>{flag}</Text>
        <Text style={styles.message}>
          You've successfully completed the challenge!
        </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  flag: {
    fontSize: 24,
    color: '#2196F3',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default FlagScreen;
