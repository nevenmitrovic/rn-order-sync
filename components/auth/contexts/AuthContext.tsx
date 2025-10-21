import { createContext, use, useState } from "react";

import type { IAuthContext, IUser, SignInRequestType } from "../types";
import signIn from "../services";
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

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: handleSignIn,
        signOut: handleSignOut,
        isAdmin: !!user?.role,
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
