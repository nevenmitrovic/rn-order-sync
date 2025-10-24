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
import { IOrderItem, IOrderRequest } from "@/components/order/types";
import { useCreateOrder } from "@/components/order/hooks/useCreateOrder";

export default function CartTotal() {
  const { getTotalPrice, handleRemoveAllItems, cart } = useCartContext();
  const { mutate } = useCreateOrder();

  const totalAmount = Number(getTotalPrice());

  const handleCheckout = () => {
    const order: IOrderRequest = {
      totalAmount,
      items: cart.map((item) => {
        const orderItem: IOrderItem = {
          productId: item.item.id,
          name: item.item.name,
          unit: item.item.unit,
          quantity: item.quantity,
        };
        return orderItem;
      }),
    };

    mutate(order);
  };

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
        <Text style={styles.text}>${totalAmount.toFixed(2)}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>Discount: </Text>
        <Text style={styles.text}>
          ${totalAmount === 0 ? 0 : ((totalAmount * 11) / 100).toFixed(2)}
        </Text>
      </View>
      <Divider color={colors.border} />
      <View style={styles.fieldContainer}>
        <Text style={[styles.text, { fontWeight: "bold" }]}>Total:</Text>
        <Text style={styles.text}>
          ${(totalAmount - (totalAmount * 11) / 100).toFixed(2)}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <MainButton buttonText="Checkout" onPress={handleCheckout} />
        <MainButton buttonText="Clear cart" onPress={handleRemoveAllItems} />
      </View>
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
