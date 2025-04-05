import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import CryptoJS from "crypto-js";

const encryptedFlag = "U2FsdGVkX1+7hXm1pGdzdsM72Fj5E6g/2ZsE3rM9P7o="; // AES Encrypted flag
const secretKey = "CHANGEME"; // Hidden encryption key

const decryptFlag = (cipherText: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8) || "Invalid License!";
  } catch {
    return "Invalid License!";
  }
};

const ChallengeSixScreen = () => {
  const [isLicensed, setIsLicensed] = useState(false); // Hardcoded check

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚀 Welcome to Challenge 6!</Text>
      <Text style={styles.description}>
        You need a valid license to unlock premium content.
      </Text>

      {isLicensed ? (
        <Text style={styles.flag}>🎉 Flag: {decryptFlag(encryptedFlag)}</Text>
      ) : (
        <Text style={styles.locked}>❌ License required! Please purchase.</Text>
      )}

      <Button title="Check License" onPress={() => setIsLicensed(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#aaaaaa",
    textAlign: "center",
    marginBottom: 20,
  },
  flag: {
    fontSize: 18,
    color: "#00ff00",
    fontWeight: "bold",
    marginTop: 20,
  },
  locked: {
    fontSize: 18,
    color: "#ff4444",
    fontWeight: "bold",
    marginTop: 20,
  },
});

export default ChallengeSixScreen;
