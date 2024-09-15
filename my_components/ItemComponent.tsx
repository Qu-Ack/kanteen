// ItemComponent.tsx

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface ItemComponentProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ItemComponent: React.FC<ItemComponentProps> = ({
  id,
  name,
  price,
  image,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/screens/add-to-cart",
      params: { id, name, price },
    });
  };

  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: image }} style={styles.itemImage} />
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    elevation: 2,
    marginBottom: 15,
    width: "48%", // Ensures two items per row with spacing
    marginHorizontal: "1%", // Adds some horizontal margin
  },
  itemImage: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#ff6347", // Same as the tab icon color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ItemComponent;
