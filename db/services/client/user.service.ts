import queryFunction from "@/utils/queryFetcherFunction";
import {
  GetUserMembershipsRequest,
  GetUserRequest,
  LogoutRequest,
  type GetMeRequest,
} from "@/app/api/v2/types";
import type {
  UserLoginData,
  UserRegisterData,
  UserUpdateData,
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

const updateUser = (userData: UserUpdateData) =>
  queryFunction("/api/v2/users/me", { method: "PUT", json: userData });

const getUserMemberships = (userId: string) =>
  queryFunction<GetUserMembershipsRequest>(
    `/api/v2/users/${userId}/memberships`,
  ).then((data) => data.memberships);

const logout = () => queryFunction<LogoutRequest>("/api/v2/auth/logout");

const UserClientService = {
  getUser,
  getMe,
  login,
  register,
  updateUser,
  getUserMemberships,
  logout,
};

export default UserClientService;
