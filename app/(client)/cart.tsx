import { StyleSheet, Text } from "react-native";

import { useCartContext } from "@/components/cart/contexts/CartContext";
import { colors, spacing, typography } from "@/constants/theme";
import CartCard from "@/components/cart/components/CartCard";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function CartScreen() {
  const { cart } = useCartContext();

  return (
    <Animated.FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={cart}
      renderItem={({ item }) => <CartCard item={item} />}
      itemLayoutAnimation={LinearTransition}
      keyExtractor={(item) => item.item.id.toString()}
      ListEmptyComponent={() => (
        <Text style={styles.emptyComponent}>
          You {`don't`} have any items in your cart.
        </Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorBackground,
  },
  contentContainer: {
    gap: spacing.md,
    padding: spacing.md,
  },
  emptyComponent: {
    textAlign: "center",
    fontSize: typography.fontSizes.xl,
    color: colors.colorForeground,
  },
});
