import UserService from "@/db/services/server/user.service";
import { APIResponse } from "@/types/api";

const GET = UserService.getUserFeed;

type GetUserFeedResponse = APIResponse<ReturnType<typeof GET>>;

export { GET, type GetUserFeedResponse };
