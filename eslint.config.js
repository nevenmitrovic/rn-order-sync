import pluginQuery from "@tanstack/eslint-plugin-query";
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  ...pluginQuery.configs["flat/recommended"],
  {
    ignores: ["dist/*", "server/**"],
    plugins: {
      "react-native": require("eslint-plugin-react-native"),
    },
    rules: {
      "react-native/no-unused-styles": "error",
    },
  },
]);
