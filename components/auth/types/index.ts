import { z } from "zod";
import { signInSchema, signUpSchema } from "../validations";

export type SignInRequestType = z.infer<typeof signInSchema>;
export type SignUpRequestType = z.infer<typeof signUpSchema>;
