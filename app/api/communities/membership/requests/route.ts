import { APIResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "@/constants";
import getMembershipRequests from "@/features/community/lib/memberships/getMembershipRequests";

const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const communityId = searchParams.get("communityId");

    if (!communityId) {
      return NextResponse.json(
        { error: "Community ID is required" },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    const membershipRequests = (await getMembershipRequests(communityId)) || [];

    return NextResponse.json({ membershipRequests });
  } catch (error) {
    console.log("COMMUNITY_GET: " + error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};
const POST = async (req: NextRequest) => {};
const DELETE = async (req: NextRequest) => {};

type GetMembershipRequests = APIResponse<ReturnType<typeof GET>>;
type AcceptMembershipRequests = APIResponse<ReturnType<typeof POST>>;
type DeleteMembershipRequests = APIResponse<ReturnType<typeof DELETE>>;

export {
  GET,
  POST,
  DELETE,
  type GetMembershipRequests,
  type AcceptMembershipRequests,
  type DeleteMembershipRequests,
};
