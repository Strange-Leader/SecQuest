import SQLite from 'react-native-sqlite-storage';
import {encryptData, decryptData} from './encryption';

// Initialize database
const db = SQLite.openDatabase({
  name: 'user_data.db',
  location: 'default',
});

// Create tables with weak schema
export const initDatabase = () => {
  db.transaction(tx => {
    // Main profile table with weak encryption
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        profile_pic TEXT,
        last_updated TEXT,
        encrypted_data TEXT,
        hidden_flag TEXT
      );`,
      [],
      () => {
        console.log('Database initialized');
        // Insert hidden flag with weak encryption
        const flag = 'CTF{LOCAL_STORAGE_EXPLOIT_SUCCESS}';
        const encryptedFlag = encryptData(flag);
        tx.executeSql(
          'INSERT OR REPLACE INTO profiles (id, hidden_flag) VALUES (1, ?)',
          [encryptedFlag],
        );
      },
    );
  });
};

// Save profile with weak encryption
export const saveProfile = async profileData => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Encrypt sensitive data with weak encryption
      const encryptedData = encryptData(JSON.stringify(profileData));

      tx.executeSql(
        `INSERT OR REPLACE INTO profiles 
        (name, email, phone, profile_pic, last_updated, encrypted_data) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          profileData.name,
          profileData.email,
          profileData.phone,
          profileData.profilePic,
          profileData.lastUpdated,
          encryptedData,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};

// Get profile with weak decryption
export const getProfile = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM profiles WHERE id = 1',
        [],
        (_, {rows: {_array}}) => {
          if (_array.length > 0) {
            const profile = _array[0];
            // Decrypt data with weak decryption
            const decryptedData = decryptData(profile.encrypted_data);
            resolve({
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              profilePic: profile.profile_pic,
              lastUpdated: profile.last_updated,
              // Hidden flag is in encrypted_data
              hiddenFlag: profile.hidden_flag,
            });
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};
