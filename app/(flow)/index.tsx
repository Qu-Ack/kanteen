import React from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { useCart } from "./cartContext"; // Adjust the path as needed
import ItemComponent from "@/my_components/ItemComponent"; // Adjust the path as needed

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cart, addToCart } = useCart();

  const categories = ["All", "Beverages", "Snacks", "Meals", "Desserts"];

  const menuItems = [
    {
      id: 1,
      name: "Burger",
      category: "Meals",
      image: "https://example.com/burger.jpg",
      price: 5.99,
    },
    {
      id: 2,
      name: "Coke",
      category: "Beverages",
      image: "https://example.com/coke.jpg",
      price: 1.99,
    },
    {
      id: 3,
      name: "French Fries",
      category: "Snacks",
      image: "https://example.com/fries.jpg",
      price: 2.99,
    },
    {
      id: 4,
      name: "Ice Cream",
      category: "Desserts",
      image: "https://example.com/icecream.jpg",
      price: 3.49,
    },
  ];

  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredMenu = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search food..."
        onChangeText={(value) => setSearch(value)}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBar}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
        style={styles.scrollView}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ItemComponent
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        )}
        contentContainerStyle={styles.menuList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    marginBottom: 10,
  },
  scrollView: {
    height: 60,
    maxHeight: 60,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCategory: {
    backgroundColor: "#ff6347", // Same as the tab icon color
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  menuList: {
    paddingTop: 0,
  },
});

export default HomeScreen;
