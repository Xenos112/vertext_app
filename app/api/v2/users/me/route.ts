import UserService from "@/db/services/server/user.service";
import { APIResponse } from "@/types/api";

const GET = UserService.getMe;
const PUT = UserService.updateUser;

type GetMeRequest = APIResponse<ReturnType<typeof GET>>;
type UpdateUserRequest = APIResponse<ReturnType<typeof PUT>>;

export { GET, PUT, type GetMeRequest, type UpdateUserRequest };
