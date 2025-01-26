import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import validateUser from "@/utils/validate-user";

export const GET = async () => {
  const token = (await cookies()).get("auth_token");
  const user = await validateUser(token?.value);

  if (!user) {
    return NextResponse.json(
      { message: "You Must Be Authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json(user);
};
