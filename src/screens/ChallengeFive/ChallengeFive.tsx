import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {login, getProfile, checkCertificate} from './api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {handleError} from '../../utils/errorHandler';

interface CertificateInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  cipherSuite: string;
  tlsVersion: string;
}

interface Profile {
  username: string;
  email: string;
  role: string;
  flag: string;
}

const ChallengeFive = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [certificateInfo, setCertificateInfo] =
    useState<CertificateInfo | null>(null);
  const [showCertificateDetails, setShowCertificateDetails] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await login(username, password);
      if (response.token) {
        setToken(response.token);
        Alert.alert(
          'Login Successful',
          response.message + '\n\n' + response.hint,
        );
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      handleError(error, 'Login');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCertificate = async () => {
    setLoading(true);
    try {
      const response = await checkCertificate();
      setCertificateInfo(response);
      setShowCertificateDetails(true);
      Alert.alert(
        'Certificate Info',
        'Check the certificate details below for vulnerabilities',
      );
    } catch (error) {
      handleError(error, 'Certificate Check');
    } finally {
      setLoading(false);
    }
  };

  const handleGetProfile = async () => {
    if (!token) {
      Alert.alert('Error', 'Login first to get a token!');
      return;
    }

    setLoading(true);
    try {
      const response = await getProfile(token);
      if (response.flag) {
        setProfile(response);
        Alert.alert('Success!', 'You successfully bypassed TLS!');
      } else if (response.error) {
        Alert.alert(
          'Error',
          response.error + (response.hint ? '\n\n' + response.hint : ''),
        );
      }
    } catch (error) {
      handleError(error, 'Profile Fetch');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Challenge 5: TLS Bypass</Text>
      <Text style={styles.description}>
        This challenge involves bypassing TLS security. The server uses weak TLS
        configuration and has certificate validation issues. Try to intercept
        the traffic and exploit the certificate vulnerabilities!
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} disabled={loading} />

      <Button
        title="Check Certificate"
        onPress={handleCheckCertificate}
        disabled={loading}
        color="#FF9800"
      />

      {showCertificateDetails && certificateInfo && (
        <View style={styles.certificateContainer}>
          <Text style={styles.sectionTitle}>Certificate Details:</Text>
          <Text style={styles.certificateText}>
            Subject: {certificateInfo.subject}
            {'\n'}
            Issuer: {certificateInfo.issuer}
            {'\n'}
            Valid From: {certificateInfo.validFrom}
            {'\n'}
            Valid To: {certificateInfo.validTo}
            {'\n'}
            Cipher Suite: {certificateInfo.cipherSuite}
            {'\n'}
            TLS Version: {certificateInfo.tlsVersion}
          </Text>
          <Text style={styles.hint}>
            Hint: The server uses weak ciphers and has certificate validation
            issues. Try intercepting the traffic with a proxy tool!
          </Text>
        </View>
      )}

      {token && (
        <Button
          title="Get Profile"
          onPress={handleGetProfile}
          disabled={loading}
        />
      )}

      {profile && (
        <View style={styles.profileContainer}>
          <Text style={styles.profileTitle}>Profile Information:</Text>
          <Text style={styles.profileText}>
            Username: {profile.username}
            {'\n'}
            Email: {profile.email}
            {'\n'}
            Role: {profile.role}
            {'\n'}
            Flag: {profile.flag}
          </Text>
        </View>
      )}
    </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  certificateContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  certificateText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  hint: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  profileText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ChallengeFive;
