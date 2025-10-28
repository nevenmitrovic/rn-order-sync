import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/theme";
import {
  CartContextProvider,
  useCartContext,
} from "@/components/cart/contexts/CartContext";
import { useAuth } from "@/components/auth/contexts/AuthContext";
import { Pressable } from "react-native";

function Layout() {
  const { getTotalItems } = useCartContext();
  const { user, signOut } = useAuth();

  const totalItems = Number(getTotalItems());

  useEffect(() => {
    const handleDailyNotification = async () => {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const alreadyScheduled = scheduled.some((n) => n.identifier === "daily");

      if (!alreadyScheduled) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Happy new hour!",
            body: "Visit our App and get a discount!",
            color: colors.colorAccent,
          },
          trigger: {
            hour: 20,
            minute: 25,
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
          },
          identifier: "daily",
        });
      }
    };
    handleDailyNotification();
  }, [user?.role]);

  return (
    <React.Fragment>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.colorAccent,
          headerTintColor: colors.colorForeground,
        }}
      >
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Entypo name="shop" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="shopping-cart" size={size} color={color} />
            ),
            tabBarBadge: totalItems > 0 ? totalItems : undefined,
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: "Order",
            tabBarIcon: ({ color, size }) => (
              <Feather name="truck" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Entypo name="user" size={size} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={signOut}
                hitSlop={20}
                style={{ marginRight: 8, marginTop: 8 }}
              >
                <FontAwesome
                  name="sign-out"
                  color={colors.colorForeground}
                  size={24}
                />
              </Pressable>
            ),
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}

export default function ClientLayout() {
  return (
    <CartContextProvider>
      <Layout />
    </CartContextProvider>
  );
}
