import { z } from "zod";

const UserProfileUpdateSchemaValidator = z.object({
  user_name: z.string().min(3).max(50),
  bio: z.string().min(3).max(150).nullish(),
  image_url: z.string().nullish(),
  banner_url: z.string().nullish(),
  tag: z.string(),
});

type UserProfileUpdateSchemaValidatorType = z.infer<
  typeof UserProfileUpdateSchemaValidator
>;
export {
  UserProfileUpdateSchemaValidator,
  type UserProfileUpdateSchemaValidatorType,
};
