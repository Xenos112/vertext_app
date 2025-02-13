import { z } from "zod";

export const FORGET_PASSWORD_VALIDATOR = z.object({
  email: z
    .string({ message: "Please Provide an Email" })
    .email({ message: "This is Not a Valid Email" }),
});

export const FORGET_PASSWORD_CONFIRM_VALIDATOR = z.object({
  id: z
    .string({ message: "Id id Not Provided" })
    .uuid({ message: "This is Not a Valid Id" }),
  password: z
    .string()
    .min(8, { message: "Password Length is less then 8 chars" }),
});
