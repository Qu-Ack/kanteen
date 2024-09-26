import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Icon } from "react-native-elements";
import { CartProvider, useCart } from "./cartContext"; // Adjust the path as needed
import HomeScreen from "./home";
import ProfileScreen from "./profile";
import CartScreen from "./cart";

const SELECTED_ICON_COLOR = "#ff6347"; // The same color as your "Add to Cart" button

const TabLayoutContent: React.FC = () => {
  const { cart, animation } = useCart();
  const itemCount = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          const iconColor = focused ? SELECTED_ICON_COLOR : color;

          return (
            <View style={styles.iconContainer}>
              {route.name === "home" ? (
                <Icon
                  name="home"
                  type="font-awesome"
                  color={iconColor}
                  size={30}
                />
              ) : route.name === "profile" ? (
                <Icon
                  name="user"
                  type="font-awesome"
                  color={iconColor}
                  size={30}
                />
              ) : route.name === "cart" ? (
                <Animated.View style={{ transform: [{ scale: animation }] }}>
                  <Icon
                    name="shopping-cart"
                    type="font-awesome"
                    color={iconColor}
                    size={30}
                  />
                </Animated.View>
              ) : null}
              {route.name === "cart" && itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarLabel: ({ focused }) => {
          const labelColor = focused ? SELECTED_ICON_COLOR : "gray"; // Adjust as needed
          return (
            <Text style={[styles.label, { color: labelColor }]}>
              {route.name === "cart"
                ? "Cart"
                : route.name === "home"
                  ? "Home"
                  : route.name === "profile"
                    ? "Profile"
                    : ""}
            </Text>
          );
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
    </Tabs>
  );
};

const MainNavigator: React.FC = () => {
  return <TabLayoutContent />;
};

const TabLayout: React.FC = () => {
  return <MainNavigator />;
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#ff6347",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabLayout;
