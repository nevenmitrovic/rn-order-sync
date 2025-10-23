import { Tabs } from "expo-router";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/theme";
import {
  CartContextProvider,
  useCartContext,
} from "@/components/cart/contexts/CartContext";

function Layout() {
  const { getTotalItems } = useCartContext();

  const totalItems = Number(getTotalItems());

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
