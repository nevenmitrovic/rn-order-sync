import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import FormTextInput from "../common/FormTextInput";
import MainButton from "../common/MainButton";
import { signInSchema } from "./validations";
import { SignInRequestType } from "./types";
import signIn from "./services";

export default function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequestType>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInRequestType) => {
    signIn(data);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Sign In</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.formField}>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormTextInput
                placeholder="Enter email"
                label="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>
        <View style={styles.formField}>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormTextInput
                placeholder="Enter password"
                label="Password"
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
        </View>
        <MainButton buttonText="Sign in" onPress={handleSubmit(onSubmit)} />
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
  formField: {
    gap: spacing.xs,
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
  error: {
    color: colors.error,
    fontSize: typography.fontSizes.sm,
  },
});
