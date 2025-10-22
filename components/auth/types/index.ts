import { z } from "zod";
import { signInSchema, signUpSchema } from "../validations";

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  address: string;
  role: "admin" | "user";
}
export interface IAuthContext {
  user: Omit<IUser, "password"> | undefined;
  signIn: ({ email, password }: SignInRequestType) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: ({
    email,
    password,
    name,
    address,
  }: SignUpRequestType) => Promise<void>;
  isAdmin: boolean;
  isLogged: boolean;
}

export type SignInRequestType = z.infer<typeof signInSchema>;
export type SignUpRequestType = z.infer<typeof signUpSchema>;
export type SignInResponseType = {
  token: string;
  user: Omit<IUser, "password">;
};
export type SignUpResponseType = SignInResponseType;
