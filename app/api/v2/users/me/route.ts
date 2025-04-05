import UserService from "@/db/services/server/user.service";
import { APIResponse } from "@/types/api";

const GET = UserService.getMe;

type GetMeRequest = APIResponse<ReturnType<typeof GET>>;

export { GET, type GetMeRequest };
