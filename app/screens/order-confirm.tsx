"use client";

import { usePaymentContext } from "@/hooks/paymentFlowContext";
import { useCart } from "../(flow)/cartContext";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function OrderConfirm() {
  const { cart } = useCart();
  const { finalOrder, orderId } = usePaymentContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display the order ID */}
      <Text style={styles.orderId}>Order ID: {orderId}</Text>

      {/* Display the user ID and payment status */}
      <Text style={styles.userInfo}>User ID: {finalOrder.user_id}</Text>
      <Text style={styles.userInfo}>
        Payment Status: {finalOrder.payment_status}
      </Text>

      {/* Display the cart items */}
      <View style={styles.cartContainer}>
        {Object.values(cart).map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              Total Quantity: {item.quantity}
            </Text>
            <Text style={styles.itemDetails}>Eat In: {item.eatInQuantity}</Text>
            <Text style={styles.itemDetails}>
              Takeaway: {item.takeAwayQuantity}
            </Text>
            <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
            <Text style={styles.totalPrice}>
              Total Price: ₹{item.price * item.quantity}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF5E5", // Light background color
    alignItems: "center",
  },
  orderId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF8C00", // Main color
    marginBottom: 10,
    textAlign: "center",
  },
  userInfo: {
    fontSize: 16,
    color: "#333", // Darker color for text
    marginBottom: 5,
    textAlign: "center",
  },
  cartContainer: {
    width: "100%",
    marginTop: 20,
  },
  cartItem: {
    backgroundColor: "#FFDAB9", // Light orange shade for item background
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8C00", // Main color
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginTop: 5,
  },
  totalPrice: {
    fontSize: 16,
    color: "#FF8C00", // Main color
    fontWeight: "bold",
    marginTop: 5,
  },
});
