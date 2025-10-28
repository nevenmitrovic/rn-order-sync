import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";

import { IUser } from "@/components/auth/types";
import { colors, spacing } from "@/constants/theme";
import FormTextInput from "@/components/common/FormTextInput";
import MainButton from "@/components/common/MainButton";

export default function ProfileForm({
  user,
}: {
  user: Omit<IUser, "password">;
}) {
  const [status, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState();
  const cameraRef = useRef<CameraView | null>(null);

  const defaultImage = require("@/assets/user.png");

  const takePicture = async () => {
    const picture = await cameraRef.current?.takePictureAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={defaultImage} style={styles.image} />
          <Pressable
            style={styles.cameraIconContainer}
            onPress={requestPermission}
          >
            <AntDesign name="camera" size={20} color={colors.colorForeground} />
          </Pressable>
          <CameraView ref={cameraRef} mode="picture" />
        </TouchableOpacity>
      </View>
      <View>
        <FormTextInput
          onChangeText={() => {}}
          placeholder="Enter your email"
          label="Email"
          value="Email"
          keyboardType="email-address"
        />
      </View>
      <View>
        <FormTextInput
          onChangeText={() => {}}
          placeholder="Enter your name"
          label="Name"
          value="Name"
        />
      </View>
      <View>
        <FormTextInput
          onChangeText={() => {}}
          placeholder="Enter your address"
          label="Address"
          value="Address"
        />
      </View>
      <MainButton buttonText="Submit" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 250,
    borderWidth: 8,
    borderColor: colors.border,
  },
  cameraIconContainer: {
    padding: 4,
    borderRadius: 250,
    borderWidth: 4,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground,
    position: "absolute",
    bottom: 0,
    right: 10,
  },
});
