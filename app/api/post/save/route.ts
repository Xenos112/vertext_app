import { STATUS_CODES } from "@/constants";
import { APIResponse } from "@/types/api";
import prisma from "@/utils/prisma";
import validateUser from "@/utils/validate-user";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { postId } = await req.json()
    if (!postId) {
      return NextResponse.json({ error: "Post Id is required" }, { status: STATUS_CODES.BAD_REQUEST })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const user = await validateUser(token)
    if (!user) {
      return NextResponse.json({ error: "You are not logged in" }, { status: STATUS_CODES.UNAUTHORIZED })
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: STATUS_CODES.NOT_FOUND })
    }

    const isSaved = await prisma.save.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user!.id,
        },
      }
    })
    if (isSaved) {
      return NextResponse.json({ message: "You already saved this post" }, { status: STATUS_CODES.SUCCESS })
    }

    await prisma.save.create({
      data: {
        userId: user!.id,
        postId: postId,
      }
    })

    return NextResponse.json({ message: "Post saved successfully" }, { status: STATUS_CODES.SUCCESS })
  } catch (error) {
    console.log("SAVE_ERROR: " + error)
    return NextResponse.json({ error: "Something went wrong" }, { status: STATUS_CODES.SERVER_ISSUE })
  }
}

export type SavePostAPIResponse = APIResponse<ReturnType<typeof POST>>

