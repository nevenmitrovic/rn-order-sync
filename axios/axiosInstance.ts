import axios, { type AxiosInstance } from "axios";
import { Platform } from "react-native";

import { getAuthToken } from "@/components/auth/utils";

// Android emulator uses 10.0.2.2 to access localhost
const getBaseURL = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001/" + process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  return "http://localhost:3001/" + process.env.EXPO_PUBLIC_API_BASE_URL;
};

const BASE_URL = getBaseURL();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
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
