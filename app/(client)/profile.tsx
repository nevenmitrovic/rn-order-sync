import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/components/auth/contexts/AuthContext";
import ProfileForm from "@/components/user/components/ProfileForm";

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ProfileForm user={user} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorBackground,
  },
});
