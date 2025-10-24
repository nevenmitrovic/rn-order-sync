import { createContext, use, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import type {
  IAuthContext,
  IUser,
  SignInRequestType,
  SignUpRequestType,
} from "../types";
import { signIn, signUp } from "../services";
import { deleteAuthToken } from "../utils";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<Omit<IUser, "password"> | undefined>();
  const router = useRouter();

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (!user) {
          setUser(undefined);
        } else {
          setUser(JSON.parse(user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserFromStorage();
  }, []);

  const handleSignIn = async ({ email, password }: SignInRequestType) => {
    try {
      const user = await signIn({ email, password });
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSignOut = async () => {
    try {
      await deleteAuthToken();
      await AsyncStorage.removeItem("user");
      setUser(undefined);
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };
  const handleSignUp = async ({
    email,
    password,
    name,
    address,
  }: SignUpRequestType) => {
    try {
      const user = await signUp({ email, password, name, address });
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleSignUp,
        isAdmin: user?.role === "admin" ? true : false,
        isLogged: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error(
      "Error! AuthContext called from outside the AuthContextProvider",
    );
  }

  return context;
}
