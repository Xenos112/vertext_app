import { STATUS_CODES } from "@/constants";
import createCommunity from "@/features/community/lib/createCommunity";
import getCommunities from "@/features/community/lib/getCommunities";
import { newCommunityValidator } from "@/features/community/validators";
import { APIResponse } from "@/types/api";
import formatZodErrors from "@/utils/format-zod-errors";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// FIX: the getCommunities function should accept userId, search string, and more
const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    const communties = await getCommunities(userId as string);
    return NextResponse.json({ communties });
  } catch (error) {
    console.log("ERROR_GET_COMMUNITY_API", error);
    return NextResponse.json(
      { error: "Something went Wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

// TODO: the user must be subscribed to create a community
const POST = async (req: NextRequest) => {
  try {
    const { name, bio, image, banner } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);

    if (!user)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );
    const { success, data, error } = newCommunityValidator.safeParse({
      name,
      bio,
      image,
      banner,
    });
    if (!success) {
      const errors = formatZodErrors(error);
      return NextResponse.json(
        { error: errors[0] },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    const newCommunity = await createCommunity({
      creatorId: user.id,
      name: data.name,
      bio: data.bio || "",
      image: data.image || "",
      banner: data.banner || "",
    });
    return NextResponse.json(
      { community: newCommunity },
      { status: STATUS_CODES.CREATED },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

type NewCommunityApiResponse = APIResponse<ReturnType<typeof POST>>;
type GetCommunities = APIResponse<ReturnType<typeof GET>>;

export { GET, POST, type NewCommunityApiResponse, type GetCommunities };
