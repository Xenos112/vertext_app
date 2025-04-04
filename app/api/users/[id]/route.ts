import { type NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "@/constants";
import getUserById from "@/features/user/lib/getUserById";
import { APIResponse } from "@/types/api";

const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  try {
    if (!id)
      return NextResponse.json(
        { error: "Please provide a user id" },
        { status: STATUS_CODES.BAD_REQUEST },
      );

    const user = await getUserById(id);
    if (!user)
      return NextResponse.json(
        { error: "No User Found" },
        { status: STATUS_CODES.NOT_FOUND },
      );

    return NextResponse.json({ user });
  } catch (error) {
    console.log("ERROR_USER_GET: " + error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

type GetUserByIdResponse = APIResponse<ReturnType<typeof GET>>;

export { GET, type GetUserByIdResponse };
