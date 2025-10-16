import { Stack } from "expo-router";

const isAdmin = false;
const isLogged = false;

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isLogged}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAdmin && isLogged}>
        <Stack.Screen name="(client)" />
      </Stack.Protected>
      <Stack.Protected guard={isAdmin && isLogged}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>
    </Stack>
  );
}
