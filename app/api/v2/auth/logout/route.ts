import UserService from "@/db/services/server/user.service";
import { type APIResponse } from "@/types/api";

const GET = UserService.logout;

type LogoutRequest = APIResponse<ReturnType<typeof GET>>;

export { GET, type LogoutRequest };
