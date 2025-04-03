import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import validateUser from "@/utils/validate-user";
import {
  UserProfileUpdateSchemaValidator,
  UserProfileUpdateSchemaValidatorType,
} from "@/features/user/validators";
import { STATUS_CODES } from "@/constants";
import prisma from "@/utils/prisma";
import { APIResponse } from "@/types/api";

export const GET = async () => {
  const token = (await cookies()).get("auth_token");
  const user = await validateUser(token?.value);

  if (!user) {
    return NextResponse.json(
      { message: "You Must Be Authenticated" },
      { status: 401 },
    );
  }

  return NextResponse.json(user);
};

const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as UserProfileUpdateSchemaValidatorType;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);
    if (!user)
      return NextResponse.json(
        { error: "Please provide a valid auth token" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );

    const {
      success,
      data: newUserData,
      error,
    } = UserProfileUpdateSchemaValidator.safeParse(body);
    if (!success) {
      console.log(error);
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...newUserData,
      },
    });

    return NextResponse.json({ updatedUser: updatedUser });
  } catch (error) {
    console.log("ERROR_USER_POST: " + error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

type UpdateUserByIdResponse = APIResponse<ReturnType<typeof POST>>;
export { POST, type UpdateUserByIdResponse };
