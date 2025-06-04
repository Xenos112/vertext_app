import MembershipService from "@/db/services/server/membership.service";
import { APIResponse } from "@/types/api";

const GET = MembershipService.getMembership;
const POST = MembershipService.createMembership;
const DELETE = MembershipService.deleteMembership;

type GetMembershipRequest = APIResponse<ReturnType<typeof GET>>;
type CreateMembershipRequest = APIResponse<ReturnType<typeof POST>>;
type DeleteMembershipRequest = APIResponse<ReturnType<typeof DELETE>>;

export {
  GET,
  POST,
  DELETE,
  type GetMembershipRequest,
  type CreateMembershipRequest,
  type DeleteMembershipRequest,
};
