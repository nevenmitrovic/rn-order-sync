import { StyleSheet, Text, View } from "react-native";

import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import FormTextInput from "../common/FormTextInput";
import MainButton from "../common/MainButton";
import { Link } from "expo-router";

export default function SignInForm() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Sign In</Text>
      </View>
      <View style={styles.form}>
        <FormTextInput
          placeholder="Enter username"
          label="Username"
          onChangeText={() => {}}
        />
        <FormTextInput
          placeholder="Enter password"
          label="Password"
          onChangeText={() => {}}
          secureTextEntry
        />
        <MainButton buttonText="Sign in" onPress={() => {}} />
        <View style={styles.navigationContainer}>
          <Text>{`Don't`} have an account?</Text>
          <Link style={styles.link} href={"/signup"}>
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  headerText: {
    color: colors.colorForeground,
    fontSize: typography.fontSizes.xxl,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  form: {
    paddingTop: spacing.xl,
    gap: spacing.xxl,
  },
  link: {
    fontWeight: "bold",
    color: colors.colorAccent,
  },
  navigationContainer: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
});
