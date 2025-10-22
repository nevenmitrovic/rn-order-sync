import { StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import FormTextInput from "../common/FormTextInput";
import MainButton from "../common/MainButton";
import { signUpSchema } from "./validations";
import { SignUpRequestType } from "./types";
import { useAuth } from "./contexts/AuthContext";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequestType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpRequestType) => {
    await signUp(data);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Sign Up</Text>
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
        <View style={styles.formField}>
          <Controller
            name="address"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormTextInput
                placeholder="Enter address"
                label="Address"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && (
            <Text style={styles.error}>{errors.address.message}</Text>
          )}
        </View>
        <View style={styles.formField}>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormTextInput
                placeholder="Enter name"
                label="Name"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}
        </View>
        <MainButton buttonText="Sign up" onPress={handleSubmit(onSubmit)} />
        <View style={styles.navigationContainer}>
          <Text>Already have an account?</Text>
          <Link style={styles.link} href={"/signin"}>
            Sign In
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
    borderTopRightRadius: borderRadius.xxl,
    borderTopLeftRadius: borderRadius.xxl,
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
