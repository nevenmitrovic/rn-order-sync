import { Text, TextInput, StyleSheet, View } from "react-native";

import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { useState } from "react";

interface InputProps {
  placeholder: string;
  label: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function FormTextInput({
  placeholder,
  label,
  onChangeText,
  secureTextEntry,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = () => setIsFocused(true);
  const handleInputBlur = () => setIsFocused(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused ? styles.inputOnFocus : styles.inputOnBlur,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.disabled}
        aria-labelledby="labelUsername"
        onChangeText={onChangeText}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        secureTextEntry={secureTextEntry ? true : undefined}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  inputContainer: {
    gap: spacing.sm,
  },
  label: {
    color: colors.colorForeground,
    fontSize: typography.fontSizes.md,
    fontWeight: "bold",
  },
  input: {
    color: colors.colorForeground,
  },
  inputOnBlur: {
    borderBottomWidth: 1,
    borderColor: colors.disabled,
  },
  inputOnFocus: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.colorAccent,
    borderRadius: borderRadius.md,
  },
});
