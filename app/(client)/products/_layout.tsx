import { Stack } from "expo-router";

import { colors } from "@/constants/theme";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTintColor: colors.colorForeground }}>
      <Stack.Screen name="index" options={{ title: "Products" }} />
      <Stack.Screen name="[productId]" options={{ title: "Product Details" }} />
    </Stack>
  );
}
