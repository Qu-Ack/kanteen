import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [name, setName] = useState("John Doe"); // Placeholder name
  const [mobile, setMobile] = useState("1234567890"); // Placeholder mobile

  const handleUpdate = () => {
    if (mobile.length !== 10) {
      Alert.alert(
        "Invalid mobile number",
        "Please enter a valid 10-digit number",
      );
      return;
    }
    router.push({
      pathname: "/getotp",
      params: { mobile: mobile, name: name },
    });
  };
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("user_id");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Mobile Number:</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="number-pad"
          placeholder="Enter your mobile number"
        />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update & Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signoutButon} onPress={handleSignOut}>
        <Text style={styles.signoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  updateButton: {
    backgroundColor: "#ff6347", // Main theme color
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signoutButon: {
    backgroundColor: "#fff", // Main theme color
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    borderColor: "#ff6347",
    borderWidth: 1,
    alignItems: "center",
  },
  signoutButtonText: {
    color: "#ff6347",
    fontSize: 16,
    fontWeight: "bold",
  },
});
