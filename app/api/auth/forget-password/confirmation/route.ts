import { STATUS_CODES } from "@/constants";
import { FORGET_PASSWORD_CONFIRM_VALIDATOR } from "@/features/auth/validators/forget-password";
import bcrypt from "bcrypt";
import formatZodErrors from "@/utils/format-zod-errors";
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { APIResponse } from "@/types/api";

export const POST = async (req: NextRequest) => {
  try {
    const requestJson = await req.json();

    const { error, data, success } =
      FORGET_PASSWORD_CONFIRM_VALIDATOR.safeParse(requestJson);
    if (!success) {
      const errors = formatZodErrors(error);
      return NextResponse.json(
        { errors },
        { status: STATUS_CODES.BAD_REQUEST },
      );
    }

    const resetPasswordRequest = await prisma.resetPassword.findUnique({
      where: { id: data.id },
      include: {
        User: true,
      },
    });

    if (!resetPasswordRequest) {
      return NextResponse.json(
        { error: "Can't Find your Reset Password request" },
        { status: STATUS_CODES.UNAUTHORIZED },
      );
    }

    const passwordHash = bcrypt.hashSync(data.password, 10);
    await prisma.user.update({
      where: { id: resetPasswordRequest.User.id },
      data: {
        password: passwordHash,
      },
    });
  } catch (error) {
    console.log("ERROR: " + error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

export type ForgetPasswordConfirmationApiResponse = APIResponse<
  ReturnType<typeof POST>
>;
