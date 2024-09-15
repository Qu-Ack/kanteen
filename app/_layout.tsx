import TabLayout from "./(flow)/_layout"; // Adjust path if necessary
import { CartProvider } from "./(flow)/cartContext";
import AddToCartScreen from "./screens/add-to-cart";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(flow)" />
        <Stack.Screen name="screens/add-to-cart" />
      </Stack>
    </CartProvider>
  );
}
