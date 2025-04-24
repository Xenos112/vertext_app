import { APIResponse } from "@/types/api";
import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        Community: true,
        Author: {
          omit: {
            password: true,
          },
        },
        _count: {
          select: {
            Like: true,
            Save: true,
            Comment: true,
          },
        },
        Like: {
          where: {
            userId: user?.id,
          },
          select: {
            userId: true,
          },
        },
        Save: {
          where: {
            userId: user?.id,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    return NextResponse.json({ post: post }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
};

export type GetPostAPIResponse = APIResponse<ReturnType<typeof GET>>;
export { GET };
