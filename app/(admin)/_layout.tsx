import { AuthProvider } from "@/components/auth/contexts/AuthContext";
import { Stack } from "expo-router";

function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
    </Stack>
  );
}

export default function AdminLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
