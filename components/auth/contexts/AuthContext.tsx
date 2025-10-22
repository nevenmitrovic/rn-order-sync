import { createContext, use, useState } from "react";

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

  const handleSignIn = async ({ email, password }: SignInRequestType) => {
    const user = await signIn({ email, password });
    setUser(user);
  };
  const handleSignOut = async () => {
    await deleteAuthToken();
    setUser(undefined);
  };
  const handleSignUp = async ({
    email,
    password,
    name,
    address,
  }: SignUpRequestType) => {
    const user = await signUp({ email, password, name, address });
    setUser(user);
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
