import { useState, useEffect, useRef, useCallback } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import type { ExpoPushToken } from "expo-notifications";

import Constants from "expo-constants";

import { Alert, Platform } from "react-native";
import axiosInstance from "@/axios/axiosInstance";
import { AxiosResponse } from "axios";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  saveNotificationToken: () => Promise<AxiosResponse<any, any, {}> | undefined>;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Failed to get push token for push notification. Go to the settings and set a permission to granted.",
        );
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      Alert.alert(
        "Permission Denied",
        "Must be using a physical device for Push notifications",
      );
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  const saveNotificationToken = useCallback(async () => {
    if (!expoPushToken?.data) {
      console.warn("No push token available to save");
      return;
    }

    try {
      const res = await axiosInstance.post("/save-token", {
        token: expoPushToken.data,
      });
      return res;
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Server error",
        "Failed to save push notification token. Please try again.",
      );
    }
  }, [expoPushToken]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  console.log(`expo: ${expoPushToken?.data}`, `notification: ${notification}`);

  return {
    expoPushToken,
    notification,
    saveNotificationToken,
  };
};
