import formatZodErrors from "@/utils/format-zod-errors";
import prisma from "@/utils/prisma";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { APIResponse } from "@/types/api";
import { STATUS_CODES } from "@/constants";
import { FORGET_PASSWORD_VALIDATOR } from "@/features/auth/validators/forget-password";
import TwitchResetPasswordEmail from "@/emails/ForgotPassword";

export const POST = async (req: NextRequest) => {
  try {
    const jsonData = await req.json();

    const { error, data, success } =
      FORGET_PASSWORD_VALIDATOR.safeParse(jsonData);

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

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: emailSendingError } = await resend.emails.send({
      from: process.env.EMAIL_SENDER || "",
      to: [user.email!],
      subject: "Hello world",
      react: TwitchResetPasswordEmail({
        updatedDate: new Date(),
        username: user.user_name,
      }),
    });

    if (emailSendingError) {
      console.log("ERROR: " + emailSendingError.message);
      return NextResponse.json(
        { error: "Email Have Not Sent" },
        { status: STATUS_CODES.SERVER_ISSUE },
      );
    }

    await prisma.resetPassword.create({
      data: {
        userId: user.id,
        expires_at: new Date(new Date().getTime() + 60 * 60 * 1000), // 1H after he send the request
      },
    });

    return NextResponse.json(
      { message: "Email Have Been Sent" },
      { status: STATUS_CODES.SUCCESS },
    );
  } catch (error) {
    console.log("ERROR: " + error.message);
    return NextResponse.json(
      { error: "Something Went Wrong" },
      { status: STATUS_CODES.SERVER_ISSUE },
    );
  }
};

export type ForgetPasswordAPIResponse = APIResponse<ReturnType<typeof POST>>;
