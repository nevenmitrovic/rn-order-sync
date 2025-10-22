import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { colors } from "@/constants/theme";
import { IProduct } from "@/components/products/types";

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  console.log(productId);

  return <Text>PRODUCT ID</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorBackground,
  },
});
