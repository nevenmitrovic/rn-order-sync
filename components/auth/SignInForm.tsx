import { borderRadius, colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function SignInForm() {
  return (
    <View>
      <Text style={styles.form}>SignInForm</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground,
  },
});
