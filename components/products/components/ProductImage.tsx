import { Image, useWindowDimensions, View } from "react-native";

import { ProductImageProps } from "../types";
import { colors } from "@/constants/theme";

export default function ProductImage({ imageUri, size }: ProductImageProps) {
  const { width } = useWindowDimensions();

  const imageSize = size ? size : Math.min(width / 2.5, 400);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: colors.cardBackground,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{
          borderRadius: 6,
          width: imageSize,
          height: imageSize,
        }}
        source={imageUri ? { uri: imageUri } : require("@/assets/basket.jpg")}
      />
    </View>
  );
}
