import CommunityService from "@/db/services/server/community.service";
import { APIResponse } from "@/types/api";

const GET = CommunityService.getCommunities;
const POST = CommunityService.createCommunity;

type GetCommunitiesRequest = APIResponse<ReturnType<typeof GET>>;
type CreateCommunityRequest = APIResponse<ReturnType<typeof POST>>;

export { GET, POST, type GetCommunitiesRequest, type CreateCommunityRequest };
