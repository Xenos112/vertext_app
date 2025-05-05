import CommunityService from "@/db/services/server/community.service";
import { APIResponse } from "@/types/api";

const GET = CommunityService.getCommunitiesSuggestions;
type CommunityFeed = APIResponse<ReturnType<typeof GET>>;

export { GET, type CommunityFeed };
