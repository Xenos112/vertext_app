import UserService from "@/db/services/server/user.service";
import { APIResponse } from "@/types/api";

const GET = UserService.getUser;
const DELETE = UserService.deleteUser;

type GetUserRequest = APIResponse<ReturnType<typeof GET>>;
type DeleteUserRequest = APIResponse<ReturnType<typeof DELETE>>;

export { GET, DELETE, type GetUserRequest, type DeleteUserRequest };
