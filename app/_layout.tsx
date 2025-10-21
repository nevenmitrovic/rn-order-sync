import { Stack } from "expo-router";
import ToastManager from "toastify-react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";

import { queryClient } from "@/react-query/queryClient";
import { SafeAreaProvider } from "react-native-safe-area-context";

const isAdmin = false;
const isLogged = false;

export default function RootLayout() {
  const onCopy = async (text: string) => {
    try {
      // For Expo:
      await Clipboard.setStringAsync(text);
      // OR for React Native CLI:
      // await Clipboard.setString(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
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

        <ToastManager />
        <DevToolsBubble onCopy={onCopy} queryClient={queryClient} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
