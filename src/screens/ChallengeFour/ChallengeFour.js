import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {login, verify2FA, getFlag} from './api';
import QRCode from 'qrcode.react';

const ChallengeFour = () => {
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState(null);
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const handleLogin = async () => {
    if (!userID) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    setLoading(true);
    try {
      const response = await login(userID);
      if (response.token) {
        setToken(response.token);
        setShow2FA(true);
        setQrCode(response.qrCode);
        setBackupCodes(response.backupCodes);
        Alert.alert('Login Successful', 'Please complete 2FA verification');
      } else {
        Alert.alert('Login Failed', 'Invalid user ID');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async () => {
    if (!otpCode) {
      Alert.alert('Error', 'Please enter the 2FA code');
      return;
    }

    setLoading(true);
    try {
      const response = await verify2FA(token, otpCode);
      if (response.success) {
        setShow2FA(false);
        Alert.alert('Success', '2FA verification completed!');
      } else {
        setRemainingAttempts(prev => prev - 1);
        if (remainingAttempts <= 1) {
          Alert.alert(
            'Error',
            'Too many failed attempts. Use backup codes to continue.',
          );
          setShowBackupCodes(true);
        } else {
          Alert.alert(
            'Error',
            `Invalid code. ${remainingAttempts - 1} attempts remaining.`,
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify 2FA code');
    } finally {
      setLoading(false);
    }
  };

  const handleGetFlag = async () => {
    if (!token) {
      Alert.alert('Error', 'Login and complete 2FA first!');
      return;
    }

    setLoading(true);
    try {
      const response = await getFlag(token);
      if (response.flag) {
        setFlag(response.flag);
        Alert.alert('Success!', 'You successfully bypassed 2FA!');
      } else if (response.error) {
        Alert.alert(
          'Error',
          response.error + (response.hint ? '\n\n' + response.hint : ''),
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Challenge 4: 2FA Bypass</Text>
      <Text style={styles.description}>
        This challenge involves bypassing 2FA authentication. The server uses a
        TOTP-based 2FA system with backup codes. Login with user ID "2" and try
        to bypass the 2FA to get the flag!
      </Text>

      <TextInput
        placeholder="Enter User ID (2 only!)"
        value={userID}
        onChangeText={setUserID}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        title={loading ? 'Loading...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />

      {show2FA && (
        <View style={styles.twoFactorContainer}>
          <Text style={styles.sectionTitle}>2FA Verification</Text>
          <Text style={styles.instructions}>
            Scan this QR code with your authenticator app or enter the code
            manually:
          </Text>

          <View style={styles.qrContainer}>
            <QRCode value={qrCode} size={200} />
          </View>

          <TextInput
            placeholder="Enter 2FA Code"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="numeric"
            style={styles.input}
          />

          <Button
            title={loading ? 'Verifying...' : 'Verify 2FA'}
            onPress={handle2FAVerification}
            disabled={loading}
          />

          <Text style={styles.attempts}>
            Remaining attempts: {remainingAttempts}
          </Text>

          <Button
            title="Use Backup Codes"
            onPress={() => setShowBackupCodes(true)}
            color="#FF9800"
          />
        </View>
      )}

      {showBackupCodes && (
        <View style={styles.backupCodesContainer}>
          <Text style={styles.sectionTitle}>Backup Codes</Text>
          <Text style={styles.instructions}>
            Use one of these backup codes to bypass 2FA:
          </Text>
          {backupCodes.map((code, index) => (
            <Text key={index} style={styles.backupCode}>
              {code}
            </Text>
          ))}
        </View>
      )}

      {token && !show2FA && (
        <Button
          title={loading ? 'Loading...' : 'Try to Get Flag'}
          onPress={handleGetFlag}
          disabled={loading}
        />
      )}

      {flag && (
        <View style={styles.flagContainer}>
          <Text style={styles.flagText}>Flag: {flag}</Text>
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
  twoFactorContainer: {
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
  instructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  attempts: {
    fontSize: 14,
    color: '#f44336',
    marginVertical: 10,
  },
  backupCodesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  backupCode: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  flagContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffeb3b',
    borderRadius: 5,
    alignItems: 'center',
  },
  flagText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
});

export default ChallengeFour;
