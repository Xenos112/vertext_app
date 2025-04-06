import { type } from "arktype";

const LOGIN_VALIDATOR = type({
  email: "string.email",
  password: "string >= 8",
});

const REGISTER_VALIDATOR = type({
  email: "string.email",
  user_name: "5 <= string <= 20",
  password: "string >= 8",
});

const UPDATE_USER_VALIDATOR = type({
  user_name: "5 <= string <= 20",
  "bio?": "string <= 1000 | null",
  "image_url?": "string.url | null",
  "banner_url?": "string.url | null",
  "tag?": "string",
});

type UserLoginData = typeof LOGIN_VALIDATOR.infer;
type UserRegisterData = typeof REGISTER_VALIDATOR.infer;
type UserUpdateData = typeof UPDATE_USER_VALIDATOR.infer;

const UserValidators = {
  LOGIN_VALIDATOR,
  REGISTER_VALIDATOR,
  UPDATE_USER_VALIDATOR,
};

export default UserValidators;
export type { UserLoginData, UserRegisterData, UserUpdateData };
