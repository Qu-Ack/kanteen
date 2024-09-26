import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const EnterMobileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mobile, setMobile] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function handleGetOTP() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}otp`, {
        method: "POST",
        body: JSON.stringify({ mobile: mobile }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      router.push({
        pathname: "/getotp",
        params: { sesid: data.sesid, name: name },
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your Mobile Number</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={(text) => {
          setMobile(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleGetOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Get OTP On Call</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6347", // Main orange color
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ff6347", // Main orange color
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#ff6347", // Main orange color
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default EnterMobileScreen;
