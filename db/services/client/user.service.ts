import queryFunction from "@/utils/queryFetcherFunction";
import { GetUserRequest, type GetMeRequest } from "@/app/api/v2/types";
import type {
  UserLoginData,
  UserRegisterData,
} from "@/db/services/validators/user.validator";

const getUser = (id: string) =>
  queryFunction<GetUserRequest>(`/api/v2/users/${id}`).then(
    (data) => data.user,
  );
const getMe = () =>
  queryFunction<GetMeRequest>(`/api/v2/users/me`).then((data) => data.me);

const login = (data: UserLoginData) =>
  queryFunction("/api/v2/auth/login", { method: "POST", json: data });

const register = (data: UserRegisterData) =>
  queryFunction("/api/v2/auth/register", { method: "POST", json: data });

const UserClientService = {
  getUser,
  getMe,
  login,
  register,
};

export default UserClientService;
