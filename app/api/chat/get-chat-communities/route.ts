import { STATUS_CODES } from "@/constants";
import getCommunities from "@/features/community/lib/getCommunities";
import { APIResponse } from "@/types/api";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user)
      return NextResponse.json(
        { error: "You need to be logged in to do that" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );

    const communities = await getCommunities(user.id);

    return NextResponse.json({ communities });
  } catch (error) {
    console.log("ERROR_RETURNING_CHAT_COMMUNITIES: " + error);
    return NextResponse.json(
      { error: "Something Went Wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

export type RetrieveChatCommunitiesResponse = APIResponse<
  ReturnType<typeof GET>
>;
