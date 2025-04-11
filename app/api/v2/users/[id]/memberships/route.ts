import MembershipService from "@/db/services/server/membership.service";
import { type APIResponse } from "@/types/api";

// FIX: i dont know if i should let it here
const GET = MembershipService.getUserMemberships;

type GetUserMembershipsRequest = APIResponse<ReturnType<typeof GET>>;

export { GET, type GetUserMembershipsRequest };
