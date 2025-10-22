import { useGetProducts } from "@/components/products/hooks/useGetProducts";
import { StyleSheet, Text, View } from "react-native";

export default function ClientProductsScreen() {
  const { products } = useGetProducts();

  return (
    <View style={styles.container}>
      <Text>Client Products Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
