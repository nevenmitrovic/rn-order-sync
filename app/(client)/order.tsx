import { StyleSheet, Text, View } from "react-native";

export default function OrderScreen() {
  return (
    <View style={styles.container}>
      <Text>Order Screen</Text>
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
