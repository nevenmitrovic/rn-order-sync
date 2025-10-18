import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import SignUpForm from "@/components/auth/SignUpForm";
import { colors, spacing, typography } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Order Sync App</Text>
        </View>
        <SignUpForm />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.colorForeground,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoText: {
    fontSize: typography.fontSizes.xxxl,
    letterSpacing: 3,
    color: colors.colorAccent,
    fontWeight: "bold",
    paddingBottom: spacing.xl,
  },
});
