import formatZodErrors from "@/utils/format-zod-errors";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import generateToken from "@/utils/generate-token";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { APIResponse } from "@/types/api";
import { STATUS_CODES } from "@/constants";

const LOGIN_VALIDATOR = z.object({
  email: z
    .string({ message: "Email is Not Provided" })
    .email({ message: "Email Schema is Not Valid" }),
  password: z
    .string({ message: "Password is Not Provided" })
    .min(8, { message: "Passowrd Length is lesst then 8" }),
});

export const POST = async (req: NextRequest) => {
  try {
    const jsonData = await req.json();

    const { error, data, success } = LOGIN_VALIDATOR.safeParse(jsonData);

    if (!success) {
      const errors = formatZodErrors(error);
      return NextResponse.json(
        { errors },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // if the user not found
    if (!user) {
      return NextResponse.json(
        { error: "User Not Found" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );
    }

    // if the user dont have password associated with his account
    if (!user.password) {
      return NextResponse.json(
        { error: "User Is Linked With A Social Platform" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );
    }

    const isPasswordRight = bcrypt.compareSync(data.password, user.password!);

    // if password is wrong
    if (!isPasswordRight) {
      return NextResponse.json(
        { error: "Wrong Password Provided" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );
    }

    const token = generateToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token);

    return NextResponse.json(
      { message: "You Have Logged In" },
      { status: STATUS_CODES.SUCCESS },
    );
  } catch (error) {
    console.log("ERROR: " + error);
    return NextResponse.json(
      { error: "Something Went Wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

export type LoginAPIResponse = APIResponse<ReturnType<typeof POST>>;
