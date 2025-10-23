import { StyleSheet, Text, View } from "react-native";

import type { ICartItem } from "../types";
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from "@/constants/theme";
import ProductImage from "@/components/products/components/ProductImage";
import { getUnitPrice } from "../utils";
import CartCardButton from "./CartCardButton";
import { useCartContext } from "../contexts/CartContext";

export default function CartCard({ item }: { item: ICartItem }) {
  const { handleAddCartItem, handleDecreaseItemQuantity } = useCartContext();

  return (
    <View style={styles.container}>
      <ProductImage size={150} />
      <View style={styles.productInfoContainer}>
        <View style={styles.productInfo}>
          <Text style={styles.name}>{item.item.name}</Text>
          <Text style={styles.unit}>{item.item.unit}</Text>
        </View>
        <View style={styles.cartController}>
          <Text style={styles.price}>${getUnitPrice(item.item)}</Text>
          <CartCardButton
            onPressDecrease={() => handleDecreaseItemQuantity(item.item.id)}
            onPressIncrease={() => handleAddCartItem(item.item)}
            quantity={item.quantity}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: shadows.medium.elevation,
    shadowColor: shadows.medium.shadowColor,
    shadowOffset: shadows.medium.shadowOffset,
    shadowOpacity: shadows.medium.shadowOpacity,
    shadowRadius: shadows.medium.shadowRadius,
  },
  productInfoContainer: {
    flex: 1,
    gap: spacing.md,
    justifyContent: "space-between",
  },
  productInfo: {
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.fontSizes.xl,
    color: colors.colorForeground,
    fontWeight: "bold",
  },
  unit: {
    fontSize: typography.fontSizes.lg,
    color: colors.colorForeground,
  },
  cartController: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: typography.fontSizes.xxl,
    color: colors.colorForeground,
    fontWeight: "bold",
  },
});
