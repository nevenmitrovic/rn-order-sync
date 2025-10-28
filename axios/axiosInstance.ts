import axios, { type AxiosInstance } from "axios";
import { Platform } from "react-native";

import { getAuthToken } from "@/components/auth/utils";

// Android emulator uses 10.0.2.2 to access localhost
// const getBaseURL = () => {
//   if (Platform.OS === "android") {
//     // For Android emulator, replace localhost/IP with 10.0.2.2
//     return "http://10.0.2.2:3001/api";
//   }
//   // For iOS simulator and web, use the environment variable or fallback
//   return process.env.EXPO_PUBLIC_API_BASE_URL;
// };

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
console.log("Base URL:", BASE_URL);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  // baseURL: getBaseURL(),
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
