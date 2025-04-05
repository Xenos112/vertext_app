import CommunityService from "@/db/services/server/community.service";
import { APIResponse } from "@/types/api";

const GET = CommunityService.getCommunity;
const PUT = CommunityService.updateCommunity;
const DELETE = CommunityService.deleteCommunity;

type GetCommunityRequest = APIResponse<ReturnType<typeof GET>>;
type UpdateCommunityRequest = APIResponse<ReturnType<typeof PUT>>;
type DeleteCommunityRequest = APIResponse<ReturnType<typeof DELETE>>;

export {
  GET,
  PUT,
  DELETE,
  type GetCommunityRequest,
  type UpdateCommunityRequest,
  type DeleteCommunityRequest,
};
