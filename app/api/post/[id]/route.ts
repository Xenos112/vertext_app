import { APIResponse } from "@/types/api";
import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params: { id } }: { params: { id: string } }) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = await validateUser(token);

    if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

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

  }
  catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}

export type GetPostAPIResponse = APIResponse<ReturnType<typeof GET>>
