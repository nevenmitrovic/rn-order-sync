import { ActivityIndicator, StyleSheet, Text, FlatList } from "react-native";

import { useGetProducts } from "@/components/products/hooks/useGetProducts";
import { colors, spacing, typography } from "@/constants/theme";
import ProductCard from "@/components/products/components/ProductCard";

export default function ClientProductsScreen() {
  const { products, isFetchingProducts } = useGetProducts();

  if (isFetchingProducts) {
    return <ActivityIndicator size="large" color={colors.colorForeground} />;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      ListEmptyComponent={() => (
        <Text style={styles.emptyComponent}>Product list is empty.</Text>
      )}
      horizontal={false}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
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
  columnWrapper: {
    gap: 8,
  },
});
