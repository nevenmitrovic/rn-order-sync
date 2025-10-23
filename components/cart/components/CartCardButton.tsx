import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { ICartCardButton } from "../types";

export default function CartCardButton({
  onPressDecrease,
  onPressIncrease,
  quantity,
}: ICartCardButton) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPressDecrease}
        activeOpacity={0.8}
        hitSlop={20}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text>{quantity}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onPressIncrease}
        activeOpacity={0.8}
        hitSlop={20}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.colorBackground,
    padding: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  button: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.colorAccent,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "bold",
    color: colors.colorForeground,
  },
});
