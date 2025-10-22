import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

import { colors } from "@/constants/theme";
import { useGetProductById } from "@/components/products/hooks/useGetProductById";

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams();
  const { product, isFetchingProduct } = useGetProductById(productId as string);
  const navigation = useNavigation();

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

  return <Text>PRODUCT ID</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorBackground,
  },
});
