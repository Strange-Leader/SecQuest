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
import {initDatabase, saveProfile, getProfile} from './api';
import {encryptData, decryptData} from './encryption';
import {ProfileData} from '../../types/challenges';
import {ChallengeEightProps} from '../../types/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import {handleError} from '../../utils/errorHandler';

const ChallengeEight: React.FC<ChallengeEightProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [savedProfile, setSavedProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize database on component mount
    initDatabase();
    // Load saved profile if exists
    loadSavedProfile();
  }, []);

  const loadSavedProfile = async () => {
    setLoading(true);
    try {
      const profile = await getProfile();
      if (profile) {
        setSavedProfile(profile);
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
        setProfilePic(profile.profilePic);
      }
    } catch (error) {
      handleError(error, 'Profile Load');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const profileData: ProfileData = {
        name,
        email,
        phone,
        profilePic,
        lastUpdated: new Date().toISOString(),
      };

      await saveProfile(profileData);
      Alert.alert('Success', 'Profile saved successfully!');
      loadSavedProfile();
    } catch (error) {
      handleError(error, 'Profile Save');
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
        <Text style={styles.title}>Challenge 8: Local Storage Exploit</Text>
        <Text style={styles.description}>
          This challenge involves exploiting local storage vulnerabilities in a
          social media app. The app stores sensitive user data locally with weak
          encryption. Your goal is to extract the hidden flag from the local
          storage!
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {savedProfile && (
          <View style={styles.profileContainer}>
            <Text style={styles.sectionTitle}>Saved Profile:</Text>
            <Text style={styles.profileText}>Name: {savedProfile.name}</Text>
            <Text style={styles.profileText}>Email: {savedProfile.email}</Text>
            <Text style={styles.profileText}>Phone: {savedProfile.phone}</Text>
            <Text style={styles.profileText}>
              Last Updated:{' '}
              {new Date(savedProfile.lastUpdated).toLocaleString()}
            </Text>
          </View>
        )}

        <Text style={styles.hint}>
          Hint: The app uses SQLite for local storage with weak encryption. Try
          analyzing the database file and encryption implementation!
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
  profileContainer: {
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
  profileText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  hint: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ChallengeEight;
