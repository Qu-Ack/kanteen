import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useCart } from "./cartContext"; // Adjust the path as needed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePaymentContext } from "../../hooks/paymentFlowContext";
import { router } from "expo-router";

const CartScreen: React.FC = () => {
  const { cart, getTotalPrice, updateItemQuantity, removeItem } = useCart();
  const {addUserId } = usePaymentContext();
  const cartItems = Object.values(cart);

  const totalPrice = getTotalPrice();

  const handleQuantityChange = (
    id: number,
    eatInQuantity: string,
    takeAwayQuantity: string,
  ) => {
    const eatIn = parseInt(eatInQuantity) || 0;
    const takeAway = parseInt(takeAwayQuantity) || 0;

    if (eatIn === 0 && takeAway === 0) {
      removeItem(id); // Automatically remove item if both quantities are 0
    } else {
      updateItemQuantity(id, eatIn, takeAway);
    }
  };

  async function handleOrder() {
    const userId = await AsyncStorage.getItem("user_id");
    addUserId(userId!);
    router.push("/screens/payment");
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name || "Unnamed Item"}</Text>

            <Text style={styles.itemLabel}>Eat In Quantity:</Text>
            <TextInput
              style={styles.input}
              value={item.eatInQuantity.toString()}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleQuantityChange(
                  item.id,
                  text,
                  item.takeAwayQuantity.toString(),
                )
              }
            />

            <Text style={styles.itemLabel}>Takeaway Quantity:</Text>
            <TextInput
              style={styles.input}
              value={item.takeAwayQuantity.toString()}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleQuantityChange(
                  item.id,
                  item.eatInQuantity.toString(),
                  text,
                )
              }
            />

            <Text style={styles.itemPrice}>
              Price: ${Number(item.price || 0).toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove Item</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Price: ${totalPrice.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => handleOrder()}
      >
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  cartItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
    borderColor: "#ff6347", // Main orange color border
    borderWidth: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6347", // Main orange color
  },
  itemLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    marginVertical: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ff6347", // Main orange color
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  cartList: {
    flexGrow: 1,
  },
  totalContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ff6347", // Main orange color
  },
  removeButton: {
    backgroundColor: "#ff6347", // Main orange color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderButton: {
    backgroundColor: "#ff6347", // Main orange color
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartScreen;
