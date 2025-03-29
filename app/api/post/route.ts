import getPosts from "@/features/post/lib/getPosts";
import { APIResponse } from "@/types/api";
import { STATUS_CODES } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId") || undefined;
    const communityId = searchParams.get("communityId") || undefined;

    const posts = await getPosts({ userId, communityId });

    return NextResponse.json({ posts });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error as string,
      },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

type GetPosts = APIResponse<ReturnType<typeof GET>>;

export { GET, type GetPosts };
