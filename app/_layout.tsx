import { Stack } from "expo-router";
import ToastManager from "toastify-react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

import { queryClient } from "@/react-query/queryClient";
import { colors } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/components/auth/contexts/AuthContext";

function Layout() {
  const { isAdmin, isLogged } = useAuth();
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

        <ToastManager
          theme="light"
          position="top"
          icons={{
            success: (
              <AntDesign name="check-circle" size={24} color={colors.success} />
            ),
            error: (
              <MaterialIcons name="error" size={24} color={colors.error} />
            ),
            info: (
              <AntDesign name="info-circle" size={24} color={colors.info} />
            ),
            warn: <AntDesign name="warning" size={24} color={colors.warning} />,
            default: (
              <Entypo
                name="notification"
                size={24}
                color={colors.colorForeground}
              />
            ),
          }}
          // Default icon family
          iconFamily="MaterialIcons"
          // Default icon size
          iconSize={24}
        />
        <DevToolsBubble onCopy={onCopy} queryClient={queryClient} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
