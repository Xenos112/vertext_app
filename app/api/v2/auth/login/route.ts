import UserService from "@/db/services/server/user.service";
import { APIResponse } from "@/types/api";

const POST = UserService.login;

type LoginRequest = APIResponse<ReturnType<typeof POST>>;

export { POST, type LoginRequest };
