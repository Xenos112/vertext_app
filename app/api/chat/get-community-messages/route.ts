import { STATUS_CODES } from "@/constants";
import getMessages from "@/features/chat/lib/getMessages";
import { APIResponse } from "@/types/api";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const communityId = searchParams.get("communityId");

    const messages = await getMessages(communityId!);

    return NextResponse.json({ messages });
  } catch (error) {
    console.log("ERROR_RETURNING_CHAT_MESSAGES: " + error);
    return NextResponse.json({ error: "Something Went Wrong" }, { status: STATUS_CODES.SERVER_ISSUE });
  }
}

export type GetCommunityMessagesResponse = APIResponse<ReturnType<typeof GET>>;
