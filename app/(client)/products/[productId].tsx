import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { differenceInDays, parseISO } from "date-fns";

import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { useGetProductById } from "@/components/products/hooks/useGetProductById";
import ProductImage from "@/components/products/components/ProductImage";
import MainButton from "@/components/common/MainButton";

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams();
  const { product, isFetchingProduct } = useGetProductById(productId as string);
  const navigation = useNavigation();

  const daysDifference = product?.harvestDate
    ? differenceInDays(new Date(), parseISO(product.harvestDate))
    : 0;

  useEffect(() => {
    if (product?.name) {
      navigation.setOptions({
        title: product.name,
      });
    }
  }, [product?.name, navigation]);

  if (isFetchingProduct) {
    return <ActivityIndicator color={colors.colorAccent} size="large" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ProductImage />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.text}>{product?.name}</Text>
        <Text style={styles.text}>
          $
          {product?.pricePerDozen ||
            product?.pricePerKg ||
            product?.pricePerLiter}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.sectionHeader}>Product Details</Text>
        <Text style={styles.text}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>Category: </Text>
          {product &&
            product.category.charAt(0).toUpperCase() +
              product.category.slice(1)}
        </Text>
        <Text style={styles.text}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>Unit: </Text>
          {product?.unit}
        </Text>
        <Text style={styles.text}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Available quantity:{" "}
          </Text>
          {product?.availableQuantity}
        </Text>
        <Text style={styles.text}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            Harvest date:{" "}
          </Text>
          {daysDifference > 1
            ? daysDifference + " days ago"
            : daysDifference + " day ago"}
        </Text>
      </View>
      <MainButton buttonText="Add to cart" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorBackground,
    padding: spacing.md,
    gap: spacing.md,
  },
  imageContainer: {
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: typography.fontSizes.xl,
    color: colors.colorForeground,
  },
  sectionHeader: {
    fontSize: typography.fontSizes.xxl,
    color: colors.colorForeground,
    fontWeight: "bold",
  },
  details: {
    gap: spacing.sm,
  },
});
