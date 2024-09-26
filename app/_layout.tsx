import { CartProvider } from "./(flow)/cartContext";
import { Stack } from "expo-router";


export default function Layout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}  >
        <Stack.Screen name="index"></Stack.Screen>
      </Stack>
    </CartProvider>
  );
}
