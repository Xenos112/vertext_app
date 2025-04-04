import { STATUS_CODES } from "@/constants";
import getMembershipRequest from "@/features/community/lib/memberships/getMembershipRequest";
import { APIResponse } from "@/types/api";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
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

    const membershipRequest = await getMembershipRequest({
      communityId,
      userId,
    });

    return NextResponse.json({ membershipRequest });
  } catch (error) {
    console.log("COMMUNITY_GET: " + error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

export type GetMembershipRequest = APIResponse<ReturnType<typeof GET>>;
