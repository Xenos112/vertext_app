import queryFunction from "@/utils/queryFetcherFunction";
import { type GetMeRequest } from "@/app/api/v2/types";

const getUser = (id: string) => queryFunction(`/api/v2/users/${id}`);
const getMe = () =>
  queryFunction<GetMeRequest>(`/api/v2/users/me`).then((data) => data.me);

const login = (data: { email: string; password: string }) =>
  queryFunction("/api/v2/auth/login", { method: "POST", json: data });

const UserClientService = {
  getUser,
  getMe,
  login,
};

export default UserClientService;
