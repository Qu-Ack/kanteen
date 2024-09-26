import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EnterOTPScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [otp, setOtp] = useState("");
  const { sesid, name } = useLocalSearchParams();

  async function verifyOTP() {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}verifyotp`,
        {
          method: "POST",
          body: JSON.stringify({ sesid: sesid, otp: otp, name: name }),
        },
      );

      if (response.status == 401) {
        console.log("otp invalid");
        return;
      }

      const data = await response.json();
      await AsyncStorage.setItem("user_id", data.user_id);
      await AsyncStorage.setItem("name", data.name);
      await AsyncStorage.setItem("mobile", data.mobile);
      console.log(AsyncStorage.getItem("user_id"));
      router.push("/(flow)/home");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Verify OTP" onPress={verifyOTP} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default EnterOTPScreen;
