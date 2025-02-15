import { z } from "zod";

export const LOGIN_VALIDATOR = z.object({
  email: z
    .string({ message: "Email is Not Provided" })
    .email({ message: "Email Schema is Not Valid" })
    .trim(),
  password: z
    .string({ message: "Password is Not Provided" })
    .min(8, { message: "Passowrd Length is lesst then 8" })
    .trim(),
});
