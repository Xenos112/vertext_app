import UserService from "@/db/services/server/user.service";
import { APIResponse } from "@/types/api";

const POST = UserService.register;

type RegisterRequest = APIResponse<ReturnType<typeof POST>>;

export { POST, type RegisterRequest };
