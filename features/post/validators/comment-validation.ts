import { z } from "zod";

export const COMMENT_VALIDATOR = z.object({
  content: z.string({ message: "please enter a comment" }),
  postId: z.string().uuid(),
});
