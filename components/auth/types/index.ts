import { z } from "zod";
import { signInSchema } from "../validations/signin";

export type SignInRequestType = z.infer<typeof signInSchema>;
