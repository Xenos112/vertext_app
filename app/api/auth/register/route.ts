import { STATUS_CODES } from "@/constants";
import generateToken from "@/utils/generate-token";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import formatZodErrors from "@/utils/format-zod-errors";
import { NextRequest, NextResponse } from "next/server";
import { APIResponse } from "@/types/api";
import { REGISTER_VALIDATOR } from "@/features/auth/validators/register";

export const POST = async (req: NextRequest) => {
  try {
    const jsonData = await req.json();

    const { error, data, success } = REGISTER_VALIDATOR.safeParse(jsonData);

    if (!success) {
      const errors = formatZodErrors(error);
      return NextResponse.json(
        { errors },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    const exsitingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exsitingUser)
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        user_name: data.user_name,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token);

    return NextResponse.json(
      { message: "user created successfully" },
      { status: STATUS_CODES.CREATED },
    );
  } catch (error) {
    console.log("ERROR: " + error);
    return NextResponse.json(
      { error: "SomeThing Went Wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

export type RegisterApiResponse = APIResponse<ReturnType<typeof POST>>;
