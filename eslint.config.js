import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactNativePlugin from "eslint-plugin-react-native";

export default defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  ...pluginQuery.configs["flat/recommended"],
  {
    ignores: ["dist/*", "server/**"],
    plugins: {
      "react-native": reactNativePlugin,
    },
    rules: {
      "react-native/no-unused-styles": "error",
    },
  },
]);
