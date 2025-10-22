import axiosInstance from "@/axios/axiosInstance";
import { Toast } from "toastify-react-native";

import {
  IUser,
  SignInRequestType,
  SignInResponseType,
  SignUpRequestType,
  SignUpResponseType,
} from "../types";
import { AxiosError } from "axios";
import { saveAuthToken } from "../utils";

export async function signIn({
  email,
  password,
}: SignInRequestType): Promise<Omit<IUser, "password"> | undefined> {
  try {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    const response: SignInResponseType = res.data;

    await saveAuthToken(response.token);
    Toast.success("You are successfully signed in.");
    return response.user;
  } catch (error) {
    console.error(error);

    Toast.hide();
    if (error instanceof AxiosError) {
      // Handle specific HTTP status codes
      if (error.response?.status === 401) {
        Toast.error("Invalid email or password");
      } else if (error.response?.status === 404) {
        Toast.error("Authentication service not found");
      } else if (error.response?.status === 500) {
        Toast.error("Server error. Please try again later");
      } else if (error.response?.data?.message) {
        // Use server-provided error message if available
        Toast.error(error.response.data.message);
      } else {
        Toast.error("Login failed. Please check your connection");
      }
    } else {
      Toast.error("An unexpected error occurred. Please try again");
    }
  }
}

export async function signUp({
  email,
  password,
  name,
  address,
}: SignUpRequestType): Promise<Omit<IUser, "password"> | undefined> {
  try {
    const res = await axiosInstance.post("/auth/register", {
      email,
      password,
      name,
      address,
    });
    const response: SignUpResponseType = res.data;

    await saveAuthToken(response.token);
    Toast.success("You are successfully signed up.");
    return response.user;
  } catch (error) {
    console.error(error);

    Toast.hide();
    if (error instanceof AxiosError) {
      // Handle specific HTTP status codes
      if (error.response?.status === 400) {
        Toast.error("Invalid sign up data, please try again.");
      } else if (error.response?.status === 404) {
        Toast.error("Authentication service not found");
      } else if (error.response?.status === 500) {
        Toast.error("Server error. Please try again later");
      } else if (error.response?.data?.message) {
        // Use server-provided error message if available
        Toast.error(error.response.data.message);
      } else {
        Toast.error("Login failed. Please check your connection");
      }
    } else {
      Toast.error("An unexpected error occurred. Please try again");
    }
  }
}
