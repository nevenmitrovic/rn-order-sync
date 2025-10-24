import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";
import MainButton from "@/components/common/MainButton";
import { useAuth } from "@/components/auth/contexts/AuthContext";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <MainButton buttonText="signout" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorBackground,
  },
});
