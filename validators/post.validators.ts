import { z } from "zod";

export const createPostSchemaValidator = z
  .object({
    content: z.string().optional(),
    files: z
      .array(
        z.union([
          z.instanceof(File).refine((file) => file.type.includes("image"), {
            message: "Must be an image file",
          }),
          z.instanceof(File).refine((file) => file.type.includes("video"), {
            message: "Must be a video file",
          }),
        ]),
      )
      .optional(),
  })
  .refine(
    (data) =>
      (data.content !== undefined || data.files?.length) &&
      (data.content || data.files!.length > 0),
  );
