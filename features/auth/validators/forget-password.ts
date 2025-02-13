import { z } from "zod";

export const FORGET_PASSWORD_VALIDATOR = z.object({
  email: z
    .string({ message: "Please Provide an Email" })
    .email({ message: "This is Not a Valid Email" }),
});
