import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { IProduct } from "../types";
import ProductImage from "./ProductImage";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link href="/products/:productId" asChild>
      <Pressable style={styles.container}>
        <ProductImage />
        <View style={styles.productInfo}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text style={styles.unit}>{product.unit}</Text>
        </View>
        <View style={styles.productAction}>
          <Text style={styles.price}>
            $
            {product.pricePerDozen ||
              product.pricePerKg ||
              product.pricePerLiter}
          </Text>
          <TouchableOpacity activeOpacity={0.8}>
            <View style={styles.basketButton}>
              <FontAwesome6
                name="basket-shopping"
                size={20}
                color={colors.success}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground,
    padding: spacing.sm,
    gap: spacing.lg,
  },
  productInfo: {
    gap: spacing.sm,
  },
  unit: {
    color: colors.colorForeground,
    fontWeight: "thin",
    fontSize: typography.fontSizes.md,
  },
  name: {
    color: colors.colorForeground,
    fontWeight: "bold",
    fontSize: typography.fontSizes.xl,
  },
  productAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  basketButton: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.success + "40",
    padding: spacing.sm,
  },
  price: {
    fontSize: typography.fontSizes.xl,
    fontWeight: "bold",
    color: colors.colorForeground,
  },
});
