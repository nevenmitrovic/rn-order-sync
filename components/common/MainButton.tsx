import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface MainButtonProps {
  buttonText: string;
  onPress: () => void;
}

export default function MainButton({ buttonText, onPress }: MainButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.colorAccent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: colors.colorForeground,
    fontSize: typography.fontSizes.xl,
    fontWeight: "bold",
  },
});
