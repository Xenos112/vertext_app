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

type UserLoginData = typeof LOGIN_VALIDATOR.infer;
type UserRegisterData = typeof REGISTER_VALIDATOR.infer;

const UserValidators = {
  LOGIN_VALIDATOR,
  REGISTER_VALIDATOR,
};

export default UserValidators;
export type { UserLoginData, UserRegisterData };
