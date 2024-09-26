"use-client";
import { router } from "expo-router";
import { useEffect } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Welcome() {
  useEffect(() => {
    async function check() {
      try {
        const value = await AsyncStorage.getItem("user_id");
        if (value != null) {
          router.push("/(flow)/home");
        }
        console.log(value);
      } catch (err) {}
    }
    check();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Kanteen 🍽️</Text>
      <Text style={styles.subtitle}>Welcome to Your Favorite Food Spot!</Text>
      <Button
        title="Login"
        color={styles.loginButton.color}
        onPress={() => router.push("/mobile")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ff6347", // Main color
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#444",
    marginBottom: 30,
    textAlign: "center",
  },
  loginButton: {
    color: "#ff6347", // Main color for button text
  },
});
