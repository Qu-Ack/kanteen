// app/add-to-cart.tsx (or app/cart/add-to-cart.tsx if you want to nest it)

import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker"; // Correct Picker import
import { useCart } from "../(flow)/cartContext"; // Adjust path as needed

const AddToCartScreen = () => {
  const router = useRouter();
  const { id, name, price } = useLocalSearchParams(); // use useLocalSearchParams instead of useSearchParams
  const itemPrice = Number(price);
  const { addToCart } = useCart();

  const [eatInQuantity, setEatInQuantity] = useState(1);
  const [takeawayQuantity, setTakeawayQuantity] = useState(0);

  const handleAddToCart = () => {
    if (eatInQuantity > 0) {
      addToCart({
        id: Number(id),
        name,
        price: itemPrice,
        quantity: eatInQuantity,
        eatInQuantity: eatInQuantity,
        takeAwayQuantity: 0, // Set to 0 if not applicable
        serviceType: "Eat In",
      });
    }
    if (takeawayQuantity > 0) {
      addToCart({
        id: Number(id),
        name,
        price: itemPrice,
        quantity: takeawayQuantity,
        eatInQuantity: 0, // Set to 0 if not applicable
        takeAwayQuantity: takeawayQuantity,
        serviceType: "Takeaway",
      });
    }
    router.back(); // Navigate back to the home screen after adding to cart
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add {name} to Cart</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Eat In Quantity:</Text>
        <Picker
          selectedValue={eatInQuantity}
          onValueChange={(value) => setEatInQuantity(value)}
          style={styles.picker}
        >
          {[...Array(10).keys()].map((num) => (
            <Picker.Item key={num} label={`${num}`} value={num} />
          ))}
        </Picker>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Takeaway Quantity:</Text>
        <Picker
          selectedValue={takeawayQuantity}
          onValueChange={(value) => setTakeawayQuantity(value)}
          style={styles.picker}
        >
          {[...Array(10).keys()].map((num) => (
            <Picker.Item key={num} label={`${num}`} value={num} />
          ))}
        </Picker>
      </View>

      <Button title="Add to Cart" onPress={handleAddToCart} color="#FF8C00" />
      <Button title="Cancel" onPress={() => router.back()} color="#B22222" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFF5E5", // Light background color to complement the main color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF8C00", // Main color for the title text
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 18,
    marginBottom: 5,
    color: "#FF8C00", // Main color for field labels
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#FFDAB9", // Light orange shade for picker background
    borderRadius: 5,
  },
});

export default AddToCartScreen;
