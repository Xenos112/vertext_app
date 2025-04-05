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

type UserLoginData = type.infer<typeof LOGIN_VALIDATOR>;
type UserRegisterData = type.infer<typeof REGISTER_VALIDATOR>;

const UserValidators = {
  LOGIN_VALIDATOR,
  REGISTER_VALIDATOR,
};

export default UserValidators;
export type { UserLoginData, UserRegisterData };
