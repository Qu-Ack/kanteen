import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useCart } from "./cartContext"; // Adjust the path as needed
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen: React.FC = () => {
  const { cart, getTotalPrice, updateItemQuantity, removeItem } = useCart();
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
    console.log(cart);
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}order`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId, items: cart }),
      });

      if (!response.ok) {
        console.log("an error occured");
      }
      const data = await response.json();
      console.log(data);
      // router.push("/to an order confirmation screen that you can't go back from and shows you how many orders are there before you and you can go back to home
      // and your order is still visible ")
    } catch (err) {
      console.log(err);
    }
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

            <Button title="Remove Item" onPress={() => removeItem(item.id)} />
          </View>
        )}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Price: ${totalPrice.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleOrder()}>
        <Text>Order</Text>
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
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
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
  },
});

export default CartScreen;
