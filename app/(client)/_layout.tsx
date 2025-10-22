import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import { colors } from "@/constants/theme";

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.colorAccent }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",
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
  );
}
