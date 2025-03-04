import { STATUS_CODES } from "@/constants";
import { APIResponse } from "@/types/api";
import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user) return NextResponse.json({ error: "You Have to be authenticated" }, { status: STATUS_CODES.UNAUTHORIZED })

    const savedPosts = await prisma.post.findMany({
      where: {
        Save: { some: { userId: user.id } }
      },
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
    })

    return NextResponse.json({ posts: savedPosts })
  } catch (error) {
    console.log("ERROR:" + error)
    return NextResponse.json({ error: "Something went Wront" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}

export type SavedPostsApiRespose = APIResponse<ReturnType<typeof GET>>
