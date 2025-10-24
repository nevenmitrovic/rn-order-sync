import { useAuth } from "@/components/auth/contexts/AuthContext";
import MainButton from "@/components/common/MainButton";
import { StyleSheet, Text, View } from "react-native";

export default function AdminDashboardScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <MainButton buttonText="logout" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
