import { CartProvider } from "./(flow)/cartContext";
import { Stack } from "expo-router";
import PaymentContextProvider from "../hooks/paymentFlowContext";

export default function Layout() {
  return (
    <CartProvider>
      <PaymentContextProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"></Stack.Screen>
        </Stack>
      </PaymentContextProvider>
    </CartProvider>
  );
}
