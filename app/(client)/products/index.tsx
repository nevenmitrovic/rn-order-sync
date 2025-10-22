import { ActivityIndicator, StyleSheet, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetProducts } from "@/components/products/hooks/useGetProducts";
import { colors, spacing, typography } from "@/constants/theme";
import ProductCard from "@/components/products/components/ProductCard";

export default function ClientProductsScreen() {
  const { products, isFetchingProducts } = useGetProducts();

  if (isFetchingProducts) {
    return <ActivityIndicator size="large" color={colors.colorForeground} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={() => <Text>Product list is empty.</Text>}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
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
    justifyContent: "center",
    flexDirection: "row",
    fontSize: typography.fontSizes.xxl,
    fontWeight: "bold",
    color: colors.colorForeground,
  },
  columnWrapper: {
    gap: 8,
  },
});
