"use client";

import { useCart } from "../(flow)/cartContext";
import { usePaymentContext } from "../../hooks/paymentFlowContext";
import { PermissionsAndroid } from "react-native";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Geolocation from "react-native-geolocation-service"; // Import Geolocation
import { router } from "expo-router";

export default function PaymentScreen() {
  const { finalOrder, addOrderID } = usePaymentContext();
  const { cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash"); // Default to cash
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const canteenLocation = {
    latitude: 25.0506158,
    longitude: 75.8283826,
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          Alert.alert(
            "Error",
            "Unable to retrieve location. Please check your settings.",
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    const checkPermissions = async () => {
      const permissionGranted = await requestLocationPermission();
      if (permissionGranted) {
        getLocation();
      } else {
        Alert.alert(
          "Permission denied",
          "Location permission is required to proceed.",
        );
      }
    };
    checkPermissions();
  }, []);

  async function sendOrder() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}order`, {
        method: "POST",
        body: JSON.stringify({
          items: cart,
          user_id: finalOrder.user_id,
          payment_status: finalOrder.payment_status,
        }),
      });
      if (!response.ok) {
        console.log("something went wrong");
      }
      const data = await response.json();
      addOrderID(data.order_id);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "cash" && userLocation) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        canteenLocation.latitude,
        canteenLocation.longitude,
      );
      console.log(userLocation.latitude, userLocation.longitude);

      if (distance <= 20) {
        sendOrder();
        router.push("/screens/order-confirm");
      } else {
        Alert.alert(
          "Location Error",
          "You should be near the canteen to order through cash.",
        );
      }
    } else {
      Alert.alert("Success", "You can proceed with the UPI payment.");
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Options</Text>
      <Text style={styles.subtitle}>Select your payment method:</Text>

      <TouchableOpacity
        style={[
          styles.button,
          paymentMethod === "cash" && styles.selectedButton,
        ]}
        onPress={() => setPaymentMethod("cash")}
      >
        <Text style={styles.buttonText}>Cash on Counter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          paymentMethod === "upi" && styles.selectedButton,
        ]}
        onPress={() => setPaymentMethod("upi")}
      >
        <Text style={styles.buttonText}>UPI Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
        <Text style={styles.submitButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFF5E5", // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF8C00", // Main color for title
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333", // Darker color for subtitle
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFDAB9", // Light orange shade for buttons
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#FF8C00", // Main color for selected button
  },
  buttonText: {
    fontSize: 18,
    color: "#333", // Darker color for button text
  },
  submitButton: {
    backgroundColor: "#FF8C00", // Main color for submit button
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    color: "#FFFFFF", // White text for submit button
  },
});
