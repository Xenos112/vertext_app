import { STATUS_CODES } from "@/constants";
import createCommunity from "@/features/community/lib/createCommunity";
import { newCommunityValidator } from "@/features/community/validators";
import { APIResponse } from "@/types/api";
import formatZodErrors from "@/utils/format-zod-errors";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// TODO: the user must be subscribed to create a community
export const POST = async (req: NextRequest) => {
  try {
    const { name, bio, image, banner } = await req.json();
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: STATUS_CODES.UNAUTHORIZED })
    const { success, data, error } = newCommunityValidator.safeParse({ name, bio, image, banner });
    if (!success) {
      const errors = formatZodErrors(error);
      return NextResponse.json({ error: errors[0] }, { status: STATUS_CODES.BAD_REQUEST });
    }

    const newCommunity = await createCommunity({
      creatorId: user.id,
      name: data.name,
      bio: data.bio || '',
      image: data.image || '',
      banner: data.banner || ''
    });
    return NextResponse.json({ community: newCommunity }, { status: STATUS_CODES.CREATED })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
};

export type NewCommunityApiResponse = APIResponse<ReturnType<typeof POST>>;
