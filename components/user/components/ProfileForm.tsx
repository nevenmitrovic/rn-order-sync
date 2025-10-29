import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import { IUser } from "@/components/auth/types";
import { colors, spacing, typography } from "@/constants/theme";
import FormTextInput from "@/components/common/FormTextInput";
import MainButton from "@/components/common/MainButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ProfileForm({
  user,
}: {
  user: Omit<IUser, "password">;
}) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("front");
  const format = useCameraFormat(device, [
    { photoResolution: { width: 150, height: 150 } },
  ]);
  const defaultImage = require("@/assets/user.png");

  useEffect(() => {
    const getUserImgUri = async () => {
      const uri = await AsyncStorage.getItem("userImgUri");
      if (uri) {
        setImageUri(uri);
      }
    };

    getUserImgUri();
  }, []);

  const takePicture = async () => {
    try {
      const res = await cameraRef.current?.takePhoto();
      if (res?.path) {
        const name = res.path.split("/").pop() as string;
        const file = new File(
          Paths.document,
          `${new Date().getTime()}-${name}`,
        );

        const sourceFile = new File(`file://${res.path}`);
        sourceFile.copy(file);

        setImageUri(file.uri);
        await AsyncStorage.setItem("userImgUri", file.uri);
        setShowCamera(false);
      }
    } catch (e) {
      console.error(e);
      setShowCamera(false);
      Alert.alert("Camera Error", "Camera error caught. Please try again.");
    }
  };
  const toggleCameraView = () => setShowCamera((prev) => !prev);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      await AsyncStorage.setItem("userImgUri", result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

  if (!hasPermission)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Camera access is required to update your profile picture. Please grant
          camera permission in your device settings.
        </Text>
        <MainButton
          buttonText="Request camera permission"
          onPress={requestPermission}
        />
      </View>
    );
  if (device == null)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No camera device found. Please ensure your device has a working
          camera.
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={imageUri ? { uri: imageUri } : defaultImage}
            style={styles.image}
          />
          <Pressable
            style={styles.cameraIconContainer}
            onPress={toggleCameraView}
          >
            <AntDesign name="camera" size={20} color={colors.colorForeground} />
          </Pressable>
          <Pressable style={styles.cameraGalleryContainer} onPress={pickImage}>
            <MaterialCommunityIcons
              name="view-gallery"
              size={20}
              color={colors.colorForeground}
            />
          </Pressable>
          {showCamera && (
            <View style={StyleSheet.absoluteFill}>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                format={format}
                photo={true}
              />
              <Pressable onPress={takePicture} style={styles.shutterBtn}>
                <View style={styles.shutterBtnInner} />
              </Pressable>
            </View>
          )}
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
    paddingHorizontal: spacing.md,
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
  cameraGalleryContainer: {
    padding: 4,
    borderRadius: 250,
    borderWidth: 4,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground,
    position: "absolute",
    bottom: 0,
    left: 10,
  },
  errorText: {
    fontSize: typography.fontSizes.lg,
    color: colors.colorForeground,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 45,
    height: 45,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    alignSelf: "center",
  },
  shutterBtnInner: {
    width: 27,
    height: 27,
    borderRadius: 50,
  },
});
