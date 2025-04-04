import UserService from "@/db/services/server/user.service";
import { APIResponse } from "@/types/api";

const GET = UserService.getUser;
const DELETE = UserService.deleteUser;
const PUT = UserService.updateUser;

type GetUserRequest = APIResponse<ReturnType<typeof GET>>;
type UpdateUserRequest = APIResponse<ReturnType<typeof DELETE>>;
type DeleteUserRequest = APIResponse<ReturnType<typeof PUT>>;

export {
  GET,
  DELETE,
  PUT,
  type GetUserRequest,
  type UpdateUserRequest,
  type DeleteUserRequest,
};
