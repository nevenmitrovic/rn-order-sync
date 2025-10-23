import { StyleSheet, Text, View } from "react-native";

import { useCartContext } from "@/components/cart/contexts/CartContext";
import { colors, spacing } from "@/constants/theme";
import CartCard from "@/components/cart/components/CartCard";

export default function CartScreen() {
  const { cart } = useCartContext();

  return (
    <View style={styles.container}>
      {cart.map((item) => (
        <CartCard key={item.item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorBackground,
    gap: spacing.md,
    padding: spacing.md,
  },
});
