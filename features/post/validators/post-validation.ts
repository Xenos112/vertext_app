import { z } from "zod";

export const PostCreateValidator = z.object({
  content: z.string().optional(),
  urls: z.array(z.string().url()).optional(),
  communityId: z.string().uuid().optional(),
}).refine((data) => data.content || (data.urls && data.urls.length > 0) || data.communityId, {
  message: "At least one of content, urls, or communityId must be provided.",
  path: ["content", "urls", "communityId"],
});

