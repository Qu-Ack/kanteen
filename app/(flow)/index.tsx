import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { SearchBar } from "react-native-elements";
import { useCart } from "./cartContext"; // Adjust the path as needed
import ItemComponent from "@/my_components/ItemComponent"; // Adjust the path as needed

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cart, addToCart } = useCart();

  type Item = {
    ID: number;
    Name: string;
    Price: number;
    Stock: number;
    CategoryID: number;
    CategoryName: string;
  };

  type Category = {
    ID: number;
    Name: string;
  };

  const [menuItems, setMenuItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state

  const fetchItems = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}item`);
      if (!response.ok) {
        // perform error logic here
        console.log("something");
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}category`,
      );
      if (!response.ok) {
        // perform error logic here
        console.log("something");
      }
      const data = await response.json();
      console.log(data);
      setCategories(data);
    } catch (err) {
      // perform error logic here
      console.log(err);
    }
  };

  const loadData = async () => {
    setRefreshing(true);
    await Promise.all([fetchItems(), fetchCategories()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMenu = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.CategoryName === selectedCategory) &&
      item.Name.toLowerCase().includes(search.toLowerCase()),
  );

  // Function to handle refreshing the screen
  const handleRefresh = () => {
    loadData(); // Refetch items and categories when refreshing
  };

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
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "All" && styles.selectedCategory,
          ]}
          onPress={() => setSelectedCategory("All")}
        >
          <Text style={styles.categoryText}>{"All"}</Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.ID}
            style={[
              styles.categoryButton,
              selectedCategory === category.Name && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.Name)}
          >
            <Text style={styles.categoryText}>{category.Name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.ID.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ItemComponent
            id={item.ID}
            name={item.Name}
            price={item.Price}
            image={`http://google.com`}
          />
        )}
        contentContainerStyle={styles.menuList}
        refreshControl={
          // Add refresh control to the FlatList
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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
