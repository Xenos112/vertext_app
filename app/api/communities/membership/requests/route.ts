import { APIResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "@/constants";
import getMembershipRequests from "@/features/community/lib/memberships/getMembershipRequests";
import getMembershipRequest from "@/features/community/lib/memberships/getMembershipRequest";
import acceptMembershipRequest from "@/features/community/lib/memberships/acceptMembershipRequest";
import rejectMembershipRequest from "@/features/community/lib/memberships/rejectMembershipRequest";

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

const POST = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const communityId = searchParams.get("communityId");
    const userId = searchParams.get("userId");

    if (!communityId || !userId) {
      return NextResponse.json(
        { error: "Community ID and User ID are required" },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    // here to throw error if the user is already a member or does not exist
    getMembershipRequest({
      communityId,
      userId,
    });

    const newMembership = await acceptMembershipRequest({
      communityId,
      userId,
    });

    return NextResponse.json(
      { newMembership },
      { status: STATUS_CODES.SUCCESS },
    );
  } catch (error) {
    console.log("COMMUNITY_POST: " + error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

const DELETE = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const communityId = searchParams.get("communityId");
    const userId = searchParams.get("userId");

    if (!communityId || !userId) {
      return NextResponse.json(
        { error: "Community ID and User ID are required" },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    // here to throw error if the user is already a member or does not exist
    getMembershipRequest({
      communityId,
      userId,
    });

    const membershipRequest = await rejectMembershipRequest({
      communityId,
      userId,
    });

    return NextResponse.json(
      { refusedMemberShip: membershipRequest },
      { status: STATUS_CODES.SUCCESS },
    );
  } catch (error) {
    console.log("COMMUNITY_POST: " + error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

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
