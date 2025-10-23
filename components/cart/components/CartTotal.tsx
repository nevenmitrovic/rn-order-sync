import { StyleSheet, Text, View } from "react-native";

import FormTextInput from "@/components/common/FormTextInput";
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from "@/constants/theme";
import { useCartContext } from "../contexts/CartContext";
import Divider from "@/components/common/Divider";
import MainButton from "@/components/common/MainButton";

export default function CartTotal() {
  const { getTotalPrice } = useCartContext();

  const totalPrice = Number(getTotalPrice());

  return (
    <View style={styles.container}>
      <FormTextInput
        label="Discount Code"
        placeholder="Enter discount code"
        onChangeText={() => {}}
        value="value"
      />
      <View style={styles.fieldContainer}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>Sub total:</Text>
        <Text style={styles.text}>${totalPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>Discount: </Text>
        <Text style={styles.text}>
          ${totalPrice === 0 ? 0 : ((totalPrice * 11) / 100).toFixed(2)}
        </Text>
      </View>
      <Divider color={colors.border} />
      <View style={styles.fieldContainer}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>Total:</Text>
        <Text style={styles.text}>
          ${(totalPrice - (totalPrice * 11) / 100).toFixed(2)}
        </Text>
      </View>
      <MainButton buttonText="Checkout" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.cardBackground,
    elevation: shadows.medium.elevation,
    shadowColor: shadows.medium.shadowColor,
    shadowOffset: shadows.medium.shadowOffset,
    shadowOpacity: shadows.medium.shadowOpacity,
    shadowRadius: shadows.medium.shadowRadius,
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: typography.fontSizes.xl,
    color: colors.colorForeground,
  },
});
