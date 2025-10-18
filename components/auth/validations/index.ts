import { z } from "zod";

const emailRgx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const signInSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  email: z.string().regex(emailRgx, { message: "Invalid email format" }),
});

export const signUpSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  email: z.string().regex(emailRgx, { message: "Invalid email format" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  address: z.string(),
});
