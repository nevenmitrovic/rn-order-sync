import { z } from "zod";
import { signInSchema, signUpSchema } from "../validations";

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  address: string;
  role: "admin" | "user";
}

export type SignInRequestType = z.infer<typeof signInSchema>;
export type SignUpRequestType = z.infer<typeof signUpSchema>;
export type SignInResponseType = { token: string; user: User };
