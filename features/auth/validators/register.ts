import { z } from "zod";

export const REGISTER_VALIDATOR = z.object({
  user_name: z
    .string({ message: "Username is Not Provided" })
    .min(5, { message: "Username Must be less then 5 chars" })
    .max(20, { message: "Username Must not be more then 20 chars" })
    .trim(),
  email: z
    .string({ message: "Email is Not Provided" })
    .email({ message: "Email Schema is Not Valid" })
    .trim(),
  password: z
    .string({ message: "Password is Not Provided" })
    .min(8, { message: "Passowrd Length is lesst then 8" })
    .trim(),
});
