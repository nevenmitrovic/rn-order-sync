import SignInForm from "@/components/auth/SignInForm";
import { colors, spacing, typography } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function SignIn() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Order Sync App</Text>
      </View>
      <SignInForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorForeground,
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
