import queryFunction from "@/utils/queryFetcherFunction";
import { type GetMeRequest } from "@/app/api/v2/types";

const getUser = (id: string) => queryFunction(`/api/v2/users/${id}`);
const getMe = () =>
  queryFunction<GetMeRequest>(`/api/v2/users/me`).then((data) => data.me);

const UserClientService = {
  getUser,
  getMe,
};

export default UserClientService;
