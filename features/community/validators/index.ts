import { z } from "zod";

export const newCommunityValidator = z.object({
  name: z.string().max(50, { message: "Name must be less than 50 characters" }),
  bio: z.string().nullish(),
  image: z.string().url({ message: "Invalid image url" }).nullish(),
  banner: z.string().url({ message: "Invalid banner url" }).nullish(),
})
